package catalog

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/catalog"
	"github.com/gofiber/fiber/v2"
)

type ICatalogStore interface {
	Create(ctx *fiber.Ctx, catalog *catalog.Catalog) (*catalog.Catalog, error)
	FindByAlias(ctx *fiber.Ctx, alias string) (*catalog.Catalog, error)
	SelectList(ctx *fiber.Ctx, qp *catalog.QueryParamsCatalogList) (*catalog.ListCatalogResponse, error)
}
