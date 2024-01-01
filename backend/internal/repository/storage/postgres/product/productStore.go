package product

import (
	errorDomain "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/error"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/pagination"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/product"
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

type PGProductStore struct {
	store *postgres.Store
}

func NewDBProductStore(store *postgres.Store) *PGProductStore {
	return &PGProductStore{
		store: store,
	}
}

func (pg *PGProductStore) Create(cf *fiber.Ctx, p *product.Product) (*product.Product, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	ctx := cf.Context()
	tx, err := pg.store.Db().Begin(ctx)
	if err != nil {
		logger.Log.Debug("error while Create. error in method Begin", zap.Error(err))
		return nil, err
	}
	defer tx.Rollback(ctx)
	sqlSelect := sqlBuilder.Insert("products").
		Columns("catalog_id", "uuid", "alias", "name", "created_at", "updated_at", "is_deleted", "is_enabled").
		Values(p.CatalogId, p.Uuid, p.Alias, p.Name, p.CreatedAt, p.UpdatedAt, p.IsDeleted, p.IsEnabled).
		Suffix("RETURNING id")
	query, args, err := sqlSelect.ToSql()
	if err != nil {
		logger.Log.Debug("error while Create. Error building SQL", zap.Error(err))
		return nil, err
	}
	err = tx.QueryRow(ctx, query, args...).Scan(&p.Id)
	if err != nil {
		logger.Log.Debug("error while Create. error in method QueryRow", zap.Error(err))
		msg := errors.Wrap(err, "bad request")
		err = errorDomain.NewCustomError(msg, http.StatusBadRequest)
		return nil, err
	}
	tx.Commit(ctx)
	return p, nil
}

func (pg *PGProductStore) Delete(cf *fiber.Ctx, u uuid.UUID) (*product.Product, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	ctx := cf.Context()
	tx, err := pg.store.Db().Begin(ctx)
	if err != nil {
		logger.Log.Debug("error while Delete. error in method Begin", zap.Error(err))
		return nil, err
	}
	defer tx.Rollback(ctx)
	sqlSelect := sqlBuilder.Update("products").
		Set("is_deleted", true).
		Where(sq.Eq{"uuid": u})
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
	response, err := pg.FindByUuid(cf, u)
	if err != nil {
		logger.Log.Debug("error while Delete. error in method FindByUuid", zap.Error(err))
		return nil, err
	}
	return response, nil
}

func (pg *PGProductStore) Update(cf *fiber.Ctx, c *product.Product) (*product.Product, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	ctx := cf.Context()
	tx, err := pg.store.Db().Begin(ctx)
	if err != nil {
		logger.Log.Debug("error while Update. error in method Begin", zap.Error(err))
		return nil, err
	}
	defer tx.Rollback(ctx)
	sqlSelect := sqlBuilder.Update("products").
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

func (pg *PGProductStore) FindByAlias(ctx *fiber.Ctx, alias string) (*product.Product, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	sqlSelect := sqlBuilder.
		Select("id", "catalog_id", "uuid", "alias", "name", "created_at", "updated_at", "is_deleted",
			"is_enabled").
		From("products").
		Where(sq.Eq{"alias": alias})
	data := product.Product{}
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
	err = row.Scan(&data.Id, &data.CatalogId, &data.Uuid, &data.Alias, &data.Name, &data.CreatedAt, &data.UpdatedAt,
		&data.IsDeleted, &data.IsEnabled)
	if err != nil {
		logger.Log.Debug("error while FindByAlias. error in method Scan", zap.Error(err))
		msg := errors.Wrap(err, "product not found")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	images, err := pg.SelectListImage(ctx, data.Id)
	if err != nil {
		logger.Log.Debug("error while FindByUuid. error in method SelectListImage", zap.Error(err))
		return nil, err
	}
	response := &product.Product{
		Id:        data.Id,
		CatalogId: data.CatalogId,
		Uuid:      data.Uuid,
		Alias:     data.Alias,
		Name:      data.Name,
		CreatedAt: data.CreatedAt,
		UpdatedAt: data.UpdatedAt,
		IsDeleted: data.IsDeleted,
		IsEnabled: data.IsEnabled,
		Images:    images,
	}
	return response, nil
}

func (pg *PGProductStore) FindByUuid(ctx *fiber.Ctx, uuid uuid.UUID) (*product.Product, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	sqlSelect := sqlBuilder.
		Select("id", "catalog_id", "uuid", "alias", "name", "created_at", "updated_at", "is_deleted",
			"is_enabled").
		From("products").
		Where(sq.Eq{"uuid": uuid})
	data := product.Product{}
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
	err = row.Scan(&data.Id, &data.CatalogId, &data.Uuid, &data.Alias, &data.Name, &data.CreatedAt, &data.UpdatedAt,
		&data.IsDeleted, &data.IsEnabled)
	if err != nil {
		logger.Log.Debug("error while FindByUuid. error in method Scan", zap.Error(err))
		msg := errors.Wrap(err, "product not found")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	images, err := pg.SelectListImage(ctx, data.Id)
	if err != nil {
		logger.Log.Debug("error while FindByUuid. error in method SelectListImage", zap.Error(err))
		return nil, err
	}
	response := &product.Product{
		Id:        data.Id,
		CatalogId: data.CatalogId,
		Uuid:      data.Uuid,
		Alias:     data.Alias,
		Name:      data.Name,
		CreatedAt: data.CreatedAt,
		UpdatedAt: data.UpdatedAt,
		IsDeleted: data.IsDeleted,
		IsEnabled: data.IsEnabled,
		Images:    images,
	}
	return response, nil
}

func (pg *PGProductStore) SelectList(
	ctx *fiber.Ctx,
	qp *product.QueryParamsProductList) (*product.ListProductResponse, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	sqlSelect := sqlBuilder.
		Select("id", "catalog_id", "uuid", "alias", "name", "created_at", "updated_at", "is_deleted",
			"is_enabled").
		From("products").
		Where(sq.Eq{"is_deleted": false})
	countSelect := sqlBuilder.Select("COUNT(*)").From("products").Where(sq.Eq{"is_deleted": false})
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
	// get productList
	productList := make([]*product.Product, 0)
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
		data := product.Product{}
		err := rows.Scan(&data.Id, &data.CatalogId, &data.Uuid, &data.Alias, &data.Name, &data.CreatedAt,
			&data.UpdatedAt, &data.IsDeleted, &data.IsEnabled)
		if err != nil {
			logger.Log.Debug("error while SelectList. error in method Scan", zap.Error(err))
			continue
		}
		images, err := pg.SelectListImage(ctx, data.Id)
		if err != nil {
			logger.Log.Debug("error while FindByUuid. error in method SelectListImage", zap.Error(err))
			return nil, err
		}
		productResponse := &product.Product{
			Id:        data.Id,
			CatalogId: data.CatalogId,
			Uuid:      data.Uuid,
			Alias:     data.Alias,
			Name:      data.Name,
			CreatedAt: data.CreatedAt,
			UpdatedAt: data.UpdatedAt,
			IsDeleted: data.IsDeleted,
			IsEnabled: data.IsEnabled,
			Images:    images,
		}
		productList = append(productList, productResponse)
	}
	paging := pagination.GetPagination(limit, page, totalItems)
	response := product.ListProductResponse{
		Pagination: paging,
		Content:    productList,
	}
	return &response, nil
}

func (pg *PGProductStore) AddImage(cf *fiber.Ctx, p *product.ImageProduct) (*product.ImageProduct, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	ctx := cf.Context()
	tx, err := pg.store.Db().Begin(ctx)
	if err != nil {
		logger.Log.Debug("error while AddImage. error in method Begin", zap.Error(err))
		return nil, err
	}
	defer tx.Rollback(ctx)
	sqlSelect := sqlBuilder.Insert("product_images").
		Columns("product_id", "uuid", "name", "url", "size", "created_at", "updated_at", "is_deleted",
			"is_enabled").
		Values(&p.ProductId, &p.Uuid, &p.Name, &p.Url, &p.Size, &p.CreatedAt, &p.UpdatedAt, &p.IsDeleted, &p.IsEnabled).
		Suffix("RETURNING id")
	query, args, err := sqlSelect.ToSql()
	if err != nil {
		return nil, err
	}
	err = tx.QueryRow(ctx, query, args...).Scan(&p.Id)
	if err != nil {
		logger.Log.Debug("error while AddImage. error in method QueryRow", zap.Error(err))
		msg := errors.Wrap(err, "bad request")
		err = errorDomain.NewCustomError(msg, http.StatusBadRequest)
		return nil, err
	}
	tx.Commit(ctx)
	return p, nil
}

func (pg *PGProductStore) DeleteImage(cf *fiber.Ctx, u uuid.UUID) (*product.ImageProduct, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	ctx := cf.Context()
	tx, err := pg.store.Db().Begin(ctx)
	if err != nil {
		logger.Log.Debug("error while DeleteImage. error in method Begin", zap.Error(err))
		return nil, err
	}
	defer tx.Rollback(ctx)
	sqlSelect := sqlBuilder.Update("product_images").
		Set("url", "").
		Set("size", 0).
		Set("is_deleted", true).
		Where(sq.Eq{"uuid": u})
	query, args, err := sqlSelect.ToSql()
	if err != nil {
		return nil, err
	}
	_, err = tx.Exec(ctx, query, args...)
	if err != nil {
		logger.Log.Debug("error while DeleteImage. error in method QueryRow", zap.Error(err))
		msg := errors.Wrap(err, "bad request")
		err = errorDomain.NewCustomError(msg, http.StatusBadRequest)
		return nil, err
	}
	tx.Commit(ctx)
	response, err := pg.FindByUuidImage(cf, u)
	return response, nil
}

func (pg *PGProductStore) FindByUuidImage(ctx *fiber.Ctx, u uuid.UUID) (*product.ImageProduct, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	sqlSelect := sqlBuilder.Select("id", "product_id", "uuid", "name", "url", "size", "created_at",
		"updated_at", "is_deleted", "is_enabled").
		From("product_images").
		Where(sq.Eq{"uuid": u})
	data := product.ImageProduct{}
	query, args, err := sqlSelect.ToSql()
	if err != nil {
		logger.Log.Debug("error while FindByUuidImage. error in method ToSql", zap.Error(err))
		return nil, err
	}
	row := pg.store.Db().QueryRow(ctx.Context(), query, args...)
	if err != nil {
		logger.Log.Debug("error while FindByUuidImage. error in method Query", zap.Error(err))
		return nil, err
	}
	err = row.Scan(&data.Id, &data.ProductId, &data.Uuid, &data.Name, &data.Url, &data.Size, &data.CreatedAt,
		&data.UpdatedAt, &data.IsDeleted, &data.IsEnabled)
	if err != nil {
		logger.Log.Debug("error while FindByUuidImage. error in method Scan", zap.Error(err))
		msg := errors.Wrap(err, "default image by catalog not found")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	return &data, nil
}

func (pg *PGProductStore) SelectListImage(cf *fiber.Ctx, productId int) ([]*product.ImageProduct, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	sqlSelect := sqlBuilder.Select("id", "product_id", "uuid", "name", "url", "size", "created_at",
		"updated_at", "is_deleted", "is_enabled").
		From("product_images").Where(sq.Eq{"product_id": productId}).Where(sq.Eq{"is_deleted": false})
	list := make([]*product.ImageProduct, 0)
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
		data := product.ImageProduct{}
		err := rows.Scan(&data.Id, &data.ProductId, &data.Uuid, &data.Name, &data.Url, &data.Size, &data.CreatedAt,
			&data.UpdatedAt, &data.IsDeleted, &data.IsEnabled)
		if err != nil {
			logger.Log.Debug("error while SelectListImage. error in method Scan", zap.Error(err))
			continue
		}
		list = append(list, &data)
	}
	return list, nil
}
