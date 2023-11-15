package catalog

import (
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/catalog"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/pagination"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"strings"
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

func (pg *PGUserStore) SelectList(ctx *fiber.Ctx, qp *catalog.QueryParamsCatalogList) (*catalog.ListCatalogResponse, error) {
	var totalItems int64
	countQuery := "SELECT COUNT(*) FROM catalogs"
	err := pg.store.Db().QueryRow(ctx.Context(), countQuery).Scan(&totalItems)
	if err != nil {
		logger.Log.Debug("error while counting SelectAll. error in method QueryRow", zap.Error(err))
		return nil, err
	}
	hasPrevious := qp.Page > 1
	hasNext := (qp.Page * qp.Limit) < totalItems
	limit := qp.Limit
	offset := (qp.Page - 1) * limit
	sortParams := strings.Split(qp.Sort, ",")
	sqlSelect := "SELECT * FROM catalogs"
	sqlSelect += " ORDER BY"
	if len(sortParams) > 0 {
		for i, sortParam := range sortParams {
			sortFields := strings.Split(sortParam, "_")
			if len(sortFields) != 2 {
				continue
			}
			fieldName := sortFields[0]
			if fieldName == "createdAt" {
				fieldName = "created_at"
			}
			if i > 0 {
				sqlSelect += ","
			}
			sqlSelect += fmt.Sprintf(" %s %s", fieldName, sortFields[1])
		}
	}
	sqlSelect += " LIMIT $1 OFFSET $2"
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
	paging := pagination.NewPagination(&pagination.Pagination{
		HasNext:     hasNext,
		HasPrevious: hasPrevious,
		Limit:       qp.Limit,
		Page:        qp.Page,
		TotalItems:  totalItems,
	})
	response := catalog.ListCatalogResponse{
		Pagination: paging,
		Content:    catalogList,
	}
	return &response, nil
}
