package product

import (
	"fmt"
	errorDomain "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/error"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/pagination"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/product"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/searching"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/sorting"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres"
	sq "github.com/Masterminds/squirrel"
	"github.com/gofiber/fiber/v2"
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
		Columns("alias", "catalog_alias", "created_at", "deleted", "enabled", "image", "name", "updated_at", "uuid").
		Values(p.Alias, p.CatalogAlias, p.CreatedAt, p.Deleted, p.Enabled, p.Image, p.Name, p.UpdatedAt, p.Uuid).
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

func (pg *PGProductStore) SelectList(
	ctx *fiber.Ctx,
	qp *product.QueryParamsProductList) (*product.ListProductResponse, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	sqlSelect := sqlBuilder.Select("*").From("products").Where(sq.Eq{"deleted": false})
	countSelect := sqlBuilder.Select("COUNT(*)").From("products").Where(sq.Eq{"deleted": false})
	limit := qp.Limit
	page := qp.Page
	// search
	fmt.Println("qp.Catalog: ", qp.Catalog)
	fmt.Println("qp.Search: ", qp.Search)
	sqlSelect = searching.ApplySearch(sqlSelect, "catalog_alias", qp.Catalog)
	countSelect = searching.ApplySearch(countSelect, "catalog_alias", qp.Catalog)
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
		err := rows.Scan(&data.Id, &data.Alias, &data.CatalogAlias, &data.CreatedAt, &data.Deleted,
			&data.Enabled, &data.Image, &data.Name, &data.UpdatedAt, &data.Uuid)
		if err != nil {
			logger.Log.Debug("error while SelectList. error in method Scan", zap.Error(err))
			continue
		}
		productList = append(productList, &data)
	}
	paging := pagination.GetPagination(limit, page, totalItems)
	response := product.ListProductResponse{
		Pagination: paging,
		Content:    productList,
	}
	return &response, nil
}
