package catalog

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/catalog"
	errorDomain "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/error"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/pagination"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/searching"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/sorting"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres"
	sq "github.com/Masterminds/squirrel"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"net/http"
)

type PGCatalogStore struct {
	store *postgres.Store
}

func NewDBCatalogStore(store *postgres.Store) *PGCatalogStore {
	return &PGCatalogStore{
		store: store,
	}
}

func (pg *PGCatalogStore) Create(cf *fiber.Ctx, c *catalog.Catalog) (*catalog.Catalog, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	ctx := cf.Context()
	tx, err := pg.store.Db().Begin(ctx)
	if err != nil {
		logger.Log.Debug("error while Create. error in method Begin", zap.Error(err))
		return nil, err
	}
	defer tx.Rollback(ctx)
	sqlSelect := sqlBuilder.Insert("catalogs").
		Columns("alias", "created_at", "deleted", "enabled", "image", "name", "updated_at", "uuid").
		Values(c.Alias, c.CreatedAt, c.Deleted, c.Enabled, c.Image, c.Name, c.UpdatedAt, c.Uuid).
		Suffix("RETURNING id")
	query, args, err := sqlSelect.ToSql()
	if err != nil {
		logger.Log.Debug("error while Create. Error building SQL", zap.Error(err))
		return nil, err
	}
	err = tx.QueryRow(ctx, query, args...).Scan(&c.Id)
	if err != nil {
		logger.Log.Debug("error while Create. error in method QueryRow", zap.Error(err))
		msg := errors.Wrap(err, "bad request")
		err = errorDomain.NewCustomError(msg, http.StatusBadRequest)
		return nil, err
	}
	tx.Commit(ctx)
	return c, nil
}

func (pg *PGCatalogStore) Update(cf *fiber.Ctx, c *catalog.Catalog) (*catalog.Catalog, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	ctx := cf.Context()
	tx, err := pg.store.Db().Begin(ctx)
	if err != nil {
		logger.Log.Debug("error while Update. error in method Begin", zap.Error(err))
		return nil, err
	}
	defer tx.Rollback(ctx)
	sqlSelect := sqlBuilder.Update("catalogs").
		Set("alias", c.Alias).
		Set("created_at", c.CreatedAt).
		Set("deleted", c.Deleted).
		Set("enabled", c.Enabled).
		Set("image", c.Image).
		Set("name", c.Name).
		Set("updated_at", c.UpdatedAt).
		Set("uuid", c.Uuid).
		Where(sq.Eq{"uuid": c.Uuid})
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
	return c, nil
}

func (pg *PGCatalogStore) FindByAlias(ctx *fiber.Ctx, alias string) (*catalog.Catalog, error) {
	//c, cancel := context.WithTimeout(ctx.Context(), 3*time.Second)
	//defer cancel()
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	sqlSelect := sqlBuilder.Select("*").From("catalogs").Where(sq.Eq{"alias": alias})
	catalogData := catalog.Catalog{}
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
	err = row.Scan(&catalogData.Id, &catalogData.Alias, &catalogData.CreatedAt, &catalogData.Deleted,
		&catalogData.Enabled, &catalogData.Image, &catalogData.Name, &catalogData.UpdatedAt, &catalogData.Uuid)
	if err != nil {
		logger.Log.Debug("error while FindByAlias. error in method Scan", zap.Error(err))
		msg := errors.Wrap(err, "catalog not found")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	if catalogData.Deleted == true {
		msg := errors.Wrap(err, "catalog not found")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	return &catalogData, nil
}

func (pg *PGCatalogStore) FindByUuid(ctx *fiber.Ctx, uuid uuid.UUID) (*catalog.Catalog, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	sqlSelect := sqlBuilder.Select("*").From("catalogs").Where(sq.Eq{"uuid": uuid})
	catalogData := catalog.Catalog{}
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
	err = row.Scan(&catalogData.Id, &catalogData.Alias, &catalogData.CreatedAt, &catalogData.Deleted,
		&catalogData.Enabled, &catalogData.Image, &catalogData.Name, &catalogData.UpdatedAt, &catalogData.Uuid)
	if err != nil {
		logger.Log.Debug("error while FindByUuid. error in method Scan", zap.Error(err))
		msg := errors.Wrap(err, "catalog not found")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	if catalogData.Deleted == true {
		msg := errors.Wrap(err, "catalog not found")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	return &catalogData, nil
}

func (pg *PGCatalogStore) SelectList(
	ctx *fiber.Ctx,
	qp *catalog.QueryParamsCatalogList) (*catalog.ListCatalogResponse, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	sqlSelect := sqlBuilder.Select("*").From("catalogs")
	countSelect := sqlBuilder.Select("COUNT(*)").From("catalogs")
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
		sqlSelect = sqlSelect.OrderBy("created_at DESC")
		countSelect = countSelect.OrderBy("created_at DESC")
	}
	fieldMapping := map[string]string{
		"createdAt": "created_at",
	}
	sqlSelect = sorting.ApplySorting(sqlSelect, qp.Sort, fieldMapping)
	countSelect = sorting.ApplySorting(countSelect, qp.Sort, fieldMapping)
	// pagination
	sqlSelect = pagination.ApplyPagination(sqlSelect, page, limit)
	countSelect = pagination.ApplyPagination(countSelect, page, limit)
	// get catalogList
	catalogList := make([]*catalog.Catalog, 0)
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
		catalogData := catalog.Catalog{}
		err := rows.Scan(&catalogData.Id, &catalogData.Alias, &catalogData.CreatedAt, &catalogData.Deleted,
			&catalogData.Enabled, &catalogData.Image, &catalogData.Name, &catalogData.UpdatedAt, &catalogData.Uuid)
		if err != nil {
			logger.Log.Debug("error while SelectList. error in method Scan", zap.Error(err))
			continue
		}
		catalogList = append(catalogList, &catalogData)
	}
	paging := pagination.GetPagination(limit, page, totalItems)
	response := catalog.ListCatalogResponse{
		Pagination: paging,
		Content:    catalogList,
	}
	return &response, nil
}