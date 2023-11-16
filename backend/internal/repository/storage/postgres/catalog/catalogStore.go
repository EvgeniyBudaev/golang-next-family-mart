package catalog

import (
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/catalog"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/pagination"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres"
	sq "github.com/Masterminds/squirrel"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"strings"
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

func (pg *PGCatalogStore) SelectList(ctx *fiber.Ctx, qp *catalog.QueryParamsCatalogList) (*catalog.ListCatalogResponse, error) {
	psql := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	sqlSelect := psql.Select("*").From("catalogs")
	countQuery := "SELECT COUNT(*) FROM catalogs"
	// searching
	if qp.Search != "" {
		searchString := strings.ToLower(strings.TrimSpace(qp.Search))
		sqlSelect = sqlSelect.Where("LOWER(name) LIKE ?", "%"+searchString+"%")
		countQuery += fmt.Sprintf(" WHERE LOWER(name) LIKE '%%%s%%'", searchString)
	}
	// pagination
	var totalItems int64
	err := pg.store.Db().QueryRow(ctx.Context(), countQuery).Scan(&totalItems)
	if err != nil {
		logger.Log.Debug("error while counting SelectList. error in method QueryRow", zap.Error(err))
		return nil, err
	}
	hasPrevious := qp.Page > 1
	hasNext := (qp.Page * qp.Limit) < totalItems
	limit := qp.Limit
	offset := (qp.Page - 1) * limit
	if qp.Sort == "" {
		sqlSelect = sqlSelect.OrderBy("created_at DESC")
		countQuery += " ORDER BY created_at DESC"
	}
	// sorting
	if qp.Sort != "" {
		sortFields := make([]string, 0)
		sortParams := strings.Split(qp.Sort, ",")
		for _, sortParam := range sortParams {
			fields := strings.Split(sortParam, "_")
			if len(fields) != 2 {
				continue
			}
			field := fields[0]
			if field == "createdAt" {
				field = "created_at"
			}
			sortFields = append(sortFields, field+" "+fields[1])
		}
		sqlSelect = sqlSelect.OrderBy(sortFields...)
	}
	sqlSelect = sqlSelect.Limit(uint64(limit)).Offset(uint64(offset))
	countQuery += " LIMIT $1 OFFSET $2" // for pagination
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
		err := rows.Scan(&catalogData.Id, &catalogData.Alias, &catalogData.CreatedAt, &catalogData.Name, &catalogData.Uuid)
		if err != nil {
			logger.Log.Debug("error while SelectList. error in method Scan", zap.Error(err))
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
