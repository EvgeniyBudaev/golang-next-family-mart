package attribute

import (
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/attribute"
	errorDomain "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/error"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/pagination"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/searching"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/sorting"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres"
	sq "github.com/Masterminds/squirrel"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"net/http"
)

type PGAttributeStore struct {
	store *postgres.Store
}

func NewDBAttributeStore(store *postgres.Store) *PGAttributeStore {
	return &PGAttributeStore{
		store: store,
	}
}

func (pg *PGAttributeStore) Create(cf *fiber.Ctx, a *attribute.Attribute) (*attribute.Attribute, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	ctx := cf.Context()
	tx, err := pg.store.Db().Begin(ctx)
	if err != nil {
		logger.Log.Debug("error while Create. error in method Begin", zap.Error(err))
		return nil, err
	}
	defer tx.Rollback(ctx)
	sqlSelect := sqlBuilder.Insert("attributes").
		Columns("alias", "created_at", "deleted", "enabled", "filtered", "name", "type", "updated_at", "uuid").
		Values(&a.Alias, &a.CreatedAt, &a.Deleted, &a.Enabled, &a.Filtered, &a.Name, &a.Type,
			&a.UpdatedAt, &a.Uuid).
		Suffix("RETURNING id")
	query, args, err := sqlSelect.ToSql()
	if err != nil {
		return nil, err
	}
	err = tx.QueryRow(ctx, query, args...).Scan(&a.Id)
	if err != nil {
		logger.Log.Debug("error while Create. error in method QueryRow", zap.Error(err))
		msg := errors.Wrap(err, "bad request")
		err = errorDomain.NewCustomError(msg, http.StatusBadRequest)
		return nil, err
	}
	tx.Commit(ctx)
	return a, nil
}

func (pg *PGAttributeStore) Update(cf *fiber.Ctx, a *attribute.Attribute) (*attribute.Attribute, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	ctx := cf.Context()
	tx, err := pg.store.Db().Begin(ctx)
	if err != nil {
		logger.Log.Debug("error while Update. error in method Begin", zap.Error(err))
		return nil, err
	}
	defer tx.Rollback(ctx)
	sqlSelect := sqlBuilder.Update("attributes").
		Set("alias", a.Alias).
		Set("created_at", a.CreatedAt).
		Set("deleted", a.Deleted).
		Set("enabled", a.Enabled).
		Set("filtered", a.Enabled).
		Set("name", a.Name).
		Set("type", a.Type).
		Set("updated_at", a.UpdatedAt).
		Set("uuid", a.Uuid).
		Where(sq.Eq{"uuid": a.Uuid})
	query, args, err := sqlSelect.ToSql()
	if err != nil {
		logger.Log.Debug("error while Update. error in method ToSql", zap.Error(err))
		return nil, err
	}
	_, err = tx.Exec(ctx, query, args...)
	if err != nil {
		logger.Log.Debug("error while Update. Error in Exec method", zap.Error(err))
		return nil, err
	}
	tx.Commit(ctx)
	return a, nil
}

func (pg *PGAttributeStore) FindByUuid(ctx *fiber.Ctx, uuid uuid.UUID) (*attribute.Attribute, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	sqlSelect := sqlBuilder.Select("*").From("attributes").Where(sq.Eq{"uuid": uuid})
	data := attribute.Attribute{}
	query, args, err := sqlSelect.ToSql()
	if err != nil {
		logger.Log.Debug("error while FindByUuid. error in method ToSql", zap.Error(err))
		return nil, err
	}
	row := pg.store.Db().QueryRow(ctx.Context(), query, args...)
	if err != nil {
		logger.Log.Debug("error while FindByUuid. error in method Query", zap.Error(err))
		return nil, err
	}
	err = row.Scan(&data.Id, &data.Alias, &data.CreatedAt, &data.Deleted,
		&data.Enabled, &data.Filtered, &data.Name, &data.Type, &data.UpdatedAt, &data.Uuid)
	if err != nil {
		logger.Log.Debug("error while FindByUuid. error in method Scan", zap.Error(err))
		msg := errors.Wrap(err, "catalog not found")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	if data.Deleted == true {
		msg := fmt.Errorf("catalog has already been deleted")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	return &data, nil
}

func (pg *PGAttributeStore) SelectList(
	ctx *fiber.Ctx, qp *attribute.QueryParamsAttributeList) (*attribute.ListAttributeResponse, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	sqlSelect := sqlBuilder.Select("*").From("attributes").Where(sq.Eq{"deleted": false})
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
		sqlSelect = sqlSelect.OrderBy("alias DESC", "name DESC", "type DESC", "updated_at DESC")
		countSelect = countSelect.OrderBy("alias DESC", "name DESC", "type DESC", "updated_at DESC")
	}
	fieldMapping := map[string]string{}
	sqlSelect = sorting.ApplySorting(sqlSelect, qp.Sort, fieldMapping)
	countSelect = sorting.ApplySorting(countSelect, qp.Sort, fieldMapping)
	// pagination
	sqlSelect = pagination.ApplyPagination(sqlSelect, page, limit)
	countSelect = pagination.ApplyPagination(countSelect, page, limit)
	// get attributeList
	attributeList := make([]*attribute.Attribute, 0)
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
		data := attribute.Attribute{}
		err := rows.Scan(&data.Id, &data.Alias, &data.CreatedAt, &data.Deleted,
			&data.Enabled, &data.Filtered, &data.Name, &data.Type, &data.UpdatedAt, &data.Uuid)
		if err != nil {
			logger.Log.Debug("error while SelectList. error in method Scan", zap.Error(err))
			continue
		}
		attributeList = append(attributeList, &data)
	}
	paging := pagination.GetPagination(limit, page, totalItems)
	response := attribute.ListAttributeResponse{
		Pagination: paging,
		Content:    attributeList,
	}
	return &response, nil
}
