package catalog

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/catalog"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/pagination"
	"github.com/gofiber/fiber/v2"
)

type ICatalogStore interface {
	Create(ctx *fiber.Ctx, catalog *catalog.Catalog) (*catalog.Catalog, error)
	SelectAll(ctx *fiber.Ctx, pag *pagination.Pagination) ([]*catalog.Catalog, error)
}
