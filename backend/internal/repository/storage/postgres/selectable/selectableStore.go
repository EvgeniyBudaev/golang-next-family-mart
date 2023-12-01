package selectable

import (
	errorDomain "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/error"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/pagination"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/searching"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/selectable"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/sorting"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres"
	sq "github.com/Masterminds/squirrel"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"net/http"
)

type PGSelectableStore struct {
	store *postgres.Store
}

func NewDBSelectableStore(store *postgres.Store) *PGSelectableStore {
	return &PGSelectableStore{
		store: store,
	}
}

func (pg *PGSelectableStore) Create(cf *fiber.Ctx, s *selectable.Selectable) (*selectable.Selectable, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	ctx := cf.Context()
	tx, err := pg.store.Db().Begin(ctx)
	if err != nil {
		logger.Log.Debug("error while Create. error in method Begin", zap.Error(err))
		return nil, err
	}
	defer tx.Rollback(ctx)
	sqlSelect := sqlBuilder.Insert("selectables").
		Columns("attribute_id", "created_at", "deleted", "enabled", "updated_at", "uuid", "value").
		Values(&s.AttributeId, &s.CreatedAt, &s.Deleted, &s.Enabled, &s.UpdatedAt, &s.Uuid, &s.Value).
		Suffix("RETURNING id")
	query, args, err := sqlSelect.ToSql()
	if err != nil {
		return nil, err
	}
	err = tx.QueryRow(ctx, query, args...).Scan(&s.Id)
	if err != nil {
		logger.Log.Debug("error while Create. error in method QueryRow", zap.Error(err))
		msg := errors.Wrap(err, "bad request")
		err = errorDomain.NewCustomError(msg, http.StatusBadRequest)
		return nil, err
	}
	tx.Commit(ctx)
	return s, nil
}

func (pg *PGSelectableStore) SelectList(
	ctx *fiber.Ctx,
	qp *selectable.QueryParamsSelectableList) (*selectable.ListSelectableResponse, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	sqlSelect := sqlBuilder.Select("id", "attribute_id", "created_at", "deleted", "enabled", "updated_at",
		"uuid", "value").From("selectables").Where(sq.Eq{"deleted": false})
	countSelect := sqlBuilder.Select("COUNT(*)").From("attributes").Where(sq.Eq{"deleted": false})
	limit := qp.Limit
	page := qp.Page
	// search
	sqlSelect = searching.ApplySearch(sqlSelect, "name", qp.Search)
	countSelect = searching.ApplySearch(countSelect, "name", qp.Search)
	// get totalItems
	totalItems, err := pagination.GetTotalItems(ctx, pg.store.Db(), countSelect)
	if err != nil {
		logger.Log.Debug("error while counting SelectList. error in method GetTotalItems", zap.Error(err))
		return nil, err
	}
	// sorting
	if qp.Sort == "" {
		sqlSelect = sqlSelect.OrderBy("value DESC")
		countSelect = countSelect.OrderBy("value DESC")
	}
	fieldMapping := map[string]string{}
	sqlSelect = sorting.ApplySorting(sqlSelect, qp.Sort, fieldMapping)
	countSelect = sorting.ApplySorting(countSelect, qp.Sort, fieldMapping)
	// pagination
	sqlSelect = pagination.ApplyPagination(sqlSelect, page, limit)
	countSelect = pagination.ApplyPagination(countSelect, page, limit)
	// get selectableList
	selectableList := make([]*selectable.Selectable, 0)
	query, args, err := sqlSelect.ToSql()
	if err != nil {
		logger.Log.Debug("error while SelectList. error in method ToSql", zap.Error(err))
		return nil, err
	}
	rows, err := pg.store.Db().Query(ctx.Context(), query, args...)
	if err != nil {
		logger.Log.Debug("error while SelectList. error in method Query", zap.Error(err))
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		data := selectable.Selectable{}
		err := rows.Scan(&data.Id, &data.AttributeId, &data.CreatedAt, &data.Deleted,
			&data.Enabled, &data.UpdatedAt, &data.Uuid, &data.Value)
		if err != nil {
			logger.Log.Debug("error while SelectList. error in method Scan", zap.Error(err))
			continue
		}
		selectableList = append(selectableList, &data)
	}
	paging := pagination.GetPagination(limit, page, totalItems)
	response := selectable.ListSelectableResponse{
		Pagination: paging,
		Content:    selectableList,
	}
	return &response, nil
}
