package pagination

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	sq "github.com/Masterminds/squirrel"
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
)

type Pagination struct {
	HasNext     bool   `json:"hasNext"`
	HasPrevious bool   `json:"hasPrevious"`
	Limit       uint64 `json:"limit"`
	Page        uint64 `json:"page"`
	TotalItems  uint64 `json:"totalItems"`
}

func NewPagination(pag *Pagination) *Pagination {
	return &Pagination{
		HasNext:     pag.HasNext,
		HasPrevious: pag.HasPrevious,
		Limit:       pag.Limit,
		Page:        pag.Page,
		TotalItems:  pag.TotalItems,
	}
}

func ApplyPagination(sqlBuilder sq.SelectBuilder, page uint64, limit uint64) sq.SelectBuilder {
	offset := (page - 1) * limit
	return sqlBuilder.Limit(limit).Offset(offset)
}

func GetTotalItems(ctx *fiber.Ctx, db *pgxpool.Pool, sqlBuilder sq.SelectBuilder) (uint64, error) {
	var totalItems uint64
	count, args, err := sqlBuilder.ToSql()
	if err != nil {
		logger.Log.Debug("error while counting GetTotalItems. error in method ToSql", zap.Error(err))
		return 0, err
	}
	err = db.QueryRow(ctx.Context(), count, args...).Scan(&totalItems)
	if err != nil {
		logger.Log.Debug("error while counting GetTotalItems. error in method Scan", zap.Error(err))
		return 0, err
	}
	return totalItems, nil
}

func GetPagination(limit uint64, page uint64, totalItems uint64) *Pagination {
	hasPrevious := page > 1
	hasNext := (page * limit) < totalItems
	paging := NewPagination(&Pagination{
		HasNext:     hasNext,
		HasPrevious: hasPrevious,
		Limit:       limit,
		Page:        page,
		TotalItems:  totalItems,
	})
	return paging
}
