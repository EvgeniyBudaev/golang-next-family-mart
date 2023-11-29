package catalog

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/catalog"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type ICatalogStore interface {
	Create(ctx *fiber.Ctx, c *catalog.Catalog) (*catalog.Catalog, error)
	Delete(ctx *fiber.Ctx, c *catalog.Catalog) (*catalog.Catalog, error)
	FindByAlias(ctx *fiber.Ctx, alias string) (*catalog.Catalog, error)
	FindByUuid(ctx *fiber.Ctx, u uuid.UUID) (*catalog.Catalog, error)
	SelectList(ctx *fiber.Ctx, qp *catalog.QueryParamsCatalogList) (*catalog.ListCatalogResponse, error)
	Update(ctx *fiber.Ctx, c *catalog.Catalog) (*catalog.Catalog, error)
}
