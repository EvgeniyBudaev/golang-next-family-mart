package catalog

import (
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/catalog"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/pagination"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

type PGUserStore struct {
	store *postgres.Store
}

func NewDBCatalogStore(store *postgres.Store) *PGUserStore {
	return &PGUserStore{
		store: store,
	}
}

func (pg *PGUserStore) Create(cf *fiber.Ctx, c *catalog.Catalog) (*catalog.Catalog, error) {
	ctx := cf.Context()
	tx, err := pg.store.Db().Begin(ctx)
	if err != nil {
		logger.Log.Debug("error while Create. error in method Begin", zap.Error(err))
		return nil, err
	}
	defer tx.Rollback(ctx)
	sqlSelect := "INSERT INTO catalogs (alias, created_at, name, uuid) VALUES ($1, $2, $3, $4) RETURNING id"
	if err := tx.QueryRow(ctx,
		sqlSelect, c.Alias, c.CreatedAt, c.Name, c.Uuid).Scan(&c.Id); err != nil {
		logger.Log.Debug("error while Create. error in method QueryRow", zap.Error(err))
		return nil, err
	}
	tx.Commit(ctx)
	return c, nil
}

func (pg *PGUserStore) SelectAll(ctx *fiber.Ctx, pag *pagination.Pagination) ([]*catalog.Catalog, error) {
	var totalItems int64
	countQuery := "SELECT COUNT(*) FROM catalogs"
	err := pg.store.Db().QueryRow(ctx.Context(), countQuery).Scan(&totalItems)
	if err != nil {
		logger.Log.Debug("error while counting SelectAll. error in method QueryRow", zap.Error(err))
		return nil, err
	}
	fmt.Println("totalItems: ", totalItems)
	currentPage := pag.Page
	fmt.Println("currentPage: ", currentPage)
	currentLimit := pag.Page
	fmt.Println("currentLimit: ", currentLimit)

	hasPrevious := pag.Page > 1
	hasNext := (pag.Page * pag.Limit) < totalItems
	fmt.Println("hasPrevious: ", hasPrevious)
	fmt.Println("hasNext: ", hasNext)

	fmt.Println("Params: ", pag)
	limit := pag.Limit
	offset := (pag.Page - 1) * limit
	sqlSelect := "SELECT * FROM catalogs ORDER BY created_at DESC, id DESC LIMIT $1 OFFSET $2"
	catalogList := make([]*catalog.Catalog, 0)
	rows, err := pg.store.Db().Query(ctx.Context(), sqlSelect, limit, offset)
	if err != nil {
		logger.Log.Debug("error while SelectAll. error in method Query", zap.Error(err))
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		catalogData := catalog.Catalog{}
		err := rows.Scan(&catalogData.Id, &catalogData.Alias, &catalogData.CreatedAt, &catalogData.Name, &catalogData.Uuid)
		if err != nil {
			logger.Log.Debug("error while SelectAll. error in method Scan", zap.Error(err))
			continue
		}
		catalogList = append(catalogList, &catalogData)
	}
	return catalogList, nil
}
