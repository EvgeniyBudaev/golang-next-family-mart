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
		Columns("catalog_id", "uuid", "alias", "name", "type", "created_at", "updated_at", "is_deleted",
			"is_enabled", "is_filtered").
		Values(&a.CatalogId, &a.Uuid, &a.Alias, &a.Name, &a.Type, &a.CreatedAt, &a.UpdatedAt, &a.IsDeleted,
			&a.IsEnabled, &a.IsFiltered).
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

func (pg *PGAttributeStore) Delete(cf *fiber.Ctx, a *attribute.Attribute) (*attribute.Attribute, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	ctx := cf.Context()
	tx, err := pg.store.Db().Begin(ctx)
	if err != nil {
		logger.Log.Debug("error while Delete. error in method Begin", zap.Error(err))
		return nil, err
	}
	defer tx.Rollback(ctx)
	sqlSelect := sqlBuilder.Update("attributes").
		Set("updated_at", a.UpdatedAt).
		Set("is_deleted", a.IsDeleted).
		Where(sq.Eq{"uuid": a.Uuid})
	query, args, err := sqlSelect.ToSql()
	if err != nil {
		logger.Log.Debug("error while Delete. error in method ToSql", zap.Error(err))
		return nil, err
	}
	_, err = tx.Exec(ctx, query, args...)
	if err != nil {
		logger.Log.Debug("error while Delete. Error in Exec method", zap.Error(err))
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
		Set("name", a.Name).
		Set("type", a.Type).
		Set("updated_at", a.UpdatedAt).
		Set("is_deleted", a.IsDeleted).
		Set("is_enabled", a.IsEnabled).
		Set("is_filtered", a.IsEnabled).
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

func (pg *PGAttributeStore) FindByAlias(ctx *fiber.Ctx, a string) (*attribute.Attribute, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	sqlSelect := sqlBuilder.
		Select("id", "catalog_id", "uuid", "alias", "name", "type", "created_at", "updated_at",
			"is_deleted", "is_enabled", "is_filtered").
		From("attributes").Where(sq.Eq{"alias": a})
	data := attribute.Attribute{}
	query, args, err := sqlSelect.ToSql()
	if err != nil {
		logger.Log.Debug("error while FindByAlias. error in method ToSql", zap.Error(err))
		return nil, err
	}
	row := pg.store.Db().QueryRow(ctx.Context(), query, args...)
	if err != nil {
		logger.Log.Debug("error while FindByAlias. error in method Query", zap.Error(err))
		return nil, err
	}
	err = row.Scan(&data.Id, &data.CatalogId, &data.Uuid, &data.Alias, &data.Name, &data.Type, &data.CreatedAt,
		&data.UpdatedAt, &data.IsDeleted, &data.IsEnabled, &data.IsFiltered)
	if err != nil {
		logger.Log.Debug("error while FindByAlias. error in method Scan", zap.Error(err))
		msg := errors.Wrap(err, "attribute not found")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	if data.IsDeleted == true {
		msg := fmt.Errorf("attribute has already been deleted")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	return &data, nil
}

func (pg *PGAttributeStore) FindByUuid(ctx *fiber.Ctx, uuid uuid.UUID) (*attribute.Attribute, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	sqlSelect := sqlBuilder.
		Select("id", "catalog_id", "uuid", "alias", "name", "type", "created_at", "updated_at",
			"is_deleted", "is_enabled", "is_filtered").
		From("attributes").Where(sq.Eq{"uuid": uuid})
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
	err = row.Scan(&data.Id, &data.CatalogId, &data.Uuid, &data.Alias, &data.Name, &data.Type, &data.CreatedAt,
		&data.UpdatedAt, &data.IsDeleted, &data.IsEnabled, &data.IsFiltered)
	if err != nil {
		logger.Log.Debug("error while FindByUuid. error in method Scan", zap.Error(err))
		msg := errors.Wrap(err, "attribute not found")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	if data.IsDeleted == true {
		msg := fmt.Errorf("attribute has already been deleted")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	return &data, nil
}

func (pg *PGAttributeStore) SelectList(
	ctx *fiber.Ctx, qp *attribute.QueryParamsAttributeList) (*attribute.ListAttributeResponse, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	sqlSelect := sqlBuilder.
		Select("id", "catalog_id", "uuid", "alias", "name", "type", "created_at", "updated_at",
			"is_deleted", "is_enabled", "is_filtered").
		From("attributes").Where(sq.Eq{"is_deleted": false})
	countSelect := sqlBuilder.Select("COUNT(*)").From("attributes").Where(sq.Eq{"is_deleted": false})
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
		err := rows.Scan(&data.Id, &data.CatalogId, &data.Uuid, &data.Alias, &data.Name, &data.Type, &data.CreatedAt,
			&data.UpdatedAt, &data.IsDeleted, &data.IsEnabled, &data.IsFiltered)
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
