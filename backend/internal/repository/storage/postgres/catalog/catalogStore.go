package catalog

import (
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/catalog"
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
		Columns("uuid", "alias", "name", "created_at", "updated_at", "is_deleted", "is_enabled").
		Values(c.Uuid, c.Alias, c.Name, c.CreatedAt, c.UpdatedAt, c.IsDeleted, c.IsEnabled).
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

func (pg *PGCatalogStore) Delete(cf *fiber.Ctx, c *catalog.Catalog) (*catalog.Catalog, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	ctx := cf.Context()
	tx, err := pg.store.Db().Begin(ctx)
	if err != nil {
		logger.Log.Debug("error while Delete. error in method Begin", zap.Error(err))
		return nil, err
	}
	defer tx.Rollback(ctx)
	sqlSelect := sqlBuilder.Update("catalogs").
		Set("uuid", c.Uuid).
		Set("alias", c.Alias).
		Set("name", c.Name).
		Set("created_at", c.CreatedAt).
		Set("updated_at", c.UpdatedAt).
		Set("is_deleted", c.IsDeleted).
		Set("is_enabled", c.IsEnabled).
		Where(sq.Eq{"uuid": c.Uuid})
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
		Set("uuid", c.Uuid).
		Set("alias", c.Alias).
		Set("name", c.Name).
		Set("created_at", c.CreatedAt).
		Set("updated_at", c.UpdatedAt).
		Set("is_deleted", c.IsDeleted).
		Set("is_enabled", c.IsEnabled).
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
	data := catalog.Catalog{}
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
	err = row.Scan(&data.Id, &data.Uuid, &data.Alias, &data.Name, &data.CreatedAt, &data.UpdatedAt, &data.IsDeleted,
		&data.IsEnabled)
	if err != nil {
		logger.Log.Debug("error while FindByAlias. error in method Scan", zap.Error(err))
		msg := errors.Wrap(err, "catalog not found")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	if data.IsDeleted == true {
		msg := fmt.Errorf("catalog has already been deleted")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	return &data, nil
}

func (pg *PGCatalogStore) FindByUuid(ctx *fiber.Ctx, uuid uuid.UUID) (*catalog.Catalog, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	sqlSelect := sqlBuilder.
		Select("id", "uuid", "alias", "name", "created_at", "updated_at", "is_deleted", "is_enabled").
		From("catalogs").
		Where(sq.Eq{"uuid": uuid})
	data := catalog.Catalog{}
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
	err = row.Scan(&data.Id, &data.Uuid, &data.Alias, &data.Name, &data.CreatedAt, &data.UpdatedAt, &data.IsDeleted,
		&data.IsEnabled)
	if err != nil {
		logger.Log.Debug("error while FindByUuid. error in method Scan", zap.Error(err))
		msg := errors.Wrap(err, "catalog not found")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	if data.IsDeleted == true {
		msg := fmt.Errorf("catalog has already been deleted")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	defaultImages, err := pg.SelectListDefaultImage(ctx, data.Id)
	if err != nil {
		logger.Log.Debug("error while FindByUuid. error in method SelectListDefaultImage", zap.Error(err))
		return nil, err
	}
	images, err := pg.SelectListImage(ctx, data.Id)
	if err != nil {
		logger.Log.Debug("error while FindByUuid. error in method SelectListImage", zap.Error(err))
		return nil, err
	}
	catalogResponse := &catalog.Catalog{
		Id:            data.Id,
		Uuid:          data.Uuid,
		Alias:         data.Alias,
		Name:          data.Name,
		CreatedAt:     data.CreatedAt,
		UpdatedAt:     data.UpdatedAt,
		IsDeleted:     data.IsDeleted,
		IsEnabled:     data.IsEnabled,
		DefaultImages: defaultImages,
		Images:        images,
	}
	return catalogResponse, nil
}

func (pg *PGCatalogStore) SelectList(
	ctx *fiber.Ctx,
	qp *catalog.QueryParamsCatalogList) (*catalog.ListCatalogResponse, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	sqlSelect := sqlBuilder.Select("*").From("catalogs").Where(sq.Eq{"deleted": false})
	countSelect := sqlBuilder.Select("COUNT(*)").From("catalogs").Where(sq.Eq{"deleted": false})
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
		sqlSelect = sqlSelect.OrderBy("updated_at DESC")
		countSelect = countSelect.OrderBy("updated_at DESC")
	}
	fieldMapping := map[string]string{
		"updatedAt": "updated_at",
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
		data := catalog.Catalog{}
		err := rows.Scan(&data.Id, &data.Uuid, &data.Alias, &data.Name, &data.CreatedAt, &data.UpdatedAt, &data.IsDeleted,
			&data.IsEnabled)
		if err != nil {
			logger.Log.Debug("error while SelectList. error in method Scan", zap.Error(err))
			continue
		}
		catalogList = append(catalogList, &data)
	}
	paging := pagination.GetPagination(limit, page, totalItems)
	response := catalog.ListCatalogResponse{
		Pagination: paging,
		Content:    catalogList,
	}
	return &response, nil
}

func (pg *PGCatalogStore) AddDefaultImage(cf *fiber.Ctx, c *catalog.DefaultImageCatalog) (*catalog.DefaultImageCatalog, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	ctx := cf.Context()
	tx, err := pg.store.Db().Begin(ctx)
	if err != nil {
		logger.Log.Debug("error while AddDefaultImage. error in method Begin", zap.Error(err))
		return nil, err
	}
	defer tx.Rollback(ctx)
	sqlSelect := sqlBuilder.Insert("catalog_default_images").
		Columns("catalog_id", "uuid", "name", "url", "size", "created_at", "updated_at", "is_deleted",
			"is_enabled").
		Values(&c.CatalogId, &c.Uuid, &c.Name, &c.Url, &c.Size, &c.CreatedAt, &c.UpdatedAt, &c.IsDeleted, &c.IsEnabled).
		Suffix("RETURNING id")
	query, args, err := sqlSelect.ToSql()
	if err != nil {
		return nil, err
	}
	err = tx.QueryRow(ctx, query, args...).Scan(&c.Id)
	if err != nil {
		logger.Log.Debug("error while AddDefaultImage. error in method QueryRow", zap.Error(err))
		msg := errors.Wrap(err, "bad request")
		err = errorDomain.NewCustomError(msg, http.StatusBadRequest)
		return nil, err
	}
	tx.Commit(ctx)
	return c, nil
}

func (pg *PGCatalogStore) SelectListDefaultImage(cf *fiber.Ctx, catalogId int) ([]*catalog.DefaultImageCatalog, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	sqlSelect := sqlBuilder.Select("id", "catalog_id", "uuid", "name", "url", "size", "created_at",
		"updated_at", "is_deleted", "is_enabled").
		From("catalog_default_images").Where(sq.Eq{"catalog_id": catalogId})
	list := make([]*catalog.DefaultImageCatalog, 0)
	query, args, err := sqlSelect.ToSql()
	if err != nil {
		logger.Log.Debug("error while SelectListDefaultImageByCatalogId. error in method ToSql", zap.Error(err))
		return nil, err
	}
	rows, err := pg.store.Db().Query(cf.Context(), query, args...)
	if err != nil {
		logger.Log.Debug("error while SelectListDefaultImageByCatalogId. error in method Query", zap.Error(err))
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		data := catalog.DefaultImageCatalog{}
		err := rows.Scan(&data.Id, &data.CatalogId, &data.Uuid, &data.Name, &data.Url, &data.Size, &data.CreatedAt,
			&data.UpdatedAt, &data.IsDeleted, &data.IsEnabled)
		if err != nil {
			logger.Log.Debug("error while SelectListDefaultImageByCatalogId. error in method Scan", zap.Error(err))
			continue
		}
		list = append(list, &data)
	}
	return list, nil
}

func (pg *PGCatalogStore) AddImage(cf *fiber.Ctx, c *catalog.ImageCatalog) (*catalog.ImageCatalog, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	ctx := cf.Context()
	tx, err := pg.store.Db().Begin(ctx)
	if err != nil {
		logger.Log.Debug("error while AddImage. error in method Begin", zap.Error(err))
		return nil, err
	}
	defer tx.Rollback(ctx)
	sqlSelect := sqlBuilder.Insert("catalog_images").
		Columns("catalog_id", "uuid", "name", "url", "size", "created_at", "updated_at", "is_deleted",
			"is_enabled").
		Values(&c.CatalogId, &c.Uuid, &c.Name, &c.Url, &c.Size, &c.CreatedAt, &c.UpdatedAt, &c.IsDeleted, &c.IsEnabled).
		Suffix("RETURNING id")
	query, args, err := sqlSelect.ToSql()
	if err != nil {
		return nil, err
	}
	err = tx.QueryRow(ctx, query, args...).Scan(&c.Id)
	if err != nil {
		logger.Log.Debug("error while AddImage. error in method QueryRow", zap.Error(err))
		msg := errors.Wrap(err, "bad request")
		err = errorDomain.NewCustomError(msg, http.StatusBadRequest)
		return nil, err
	}
	tx.Commit(ctx)
	return c, nil
}

func (pg *PGCatalogStore) SelectListImage(cf *fiber.Ctx, catalogId int) ([]*catalog.ImageCatalog, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	sqlSelect := sqlBuilder.Select("id", "catalog_id", "uuid", "name", "url", "size", "created_at",
		"updated_at", "is_deleted", "is_enabled").
		From("catalog_images").Where(sq.Eq{"catalog_id": catalogId})
	list := make([]*catalog.ImageCatalog, 0)
	query, args, err := sqlSelect.ToSql()
	if err != nil {
		logger.Log.Debug("error while SelectListImage. error in method ToSql", zap.Error(err))
		return nil, err
	}
	rows, err := pg.store.Db().Query(cf.Context(), query, args...)
	if err != nil {
		logger.Log.Debug("error while SelectListImage. error in method Query", zap.Error(err))
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		data := catalog.ImageCatalog{}
		err := rows.Scan(&data.Id, &data.CatalogId, &data.Uuid, &data.Name, &data.Url, &data.Size, &data.CreatedAt,
			&data.UpdatedAt, &data.IsDeleted, &data.IsEnabled)
		if err != nil {
			logger.Log.Debug("error while SelectListImage. error in method Scan", zap.Error(err))
			continue
		}
		list = append(list, &data)
	}
	return list, nil
}
