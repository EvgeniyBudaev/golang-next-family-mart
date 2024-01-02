package catalog

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/catalog"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type ICatalogStore interface {
	AddImage(ctx *fiber.Ctx, c *catalog.ImageCatalog) (*catalog.ImageCatalog, error)
	Create(ctx *fiber.Ctx, c *catalog.Catalog) (*catalog.Catalog, error)
	Delete(ctx *fiber.Ctx, u uuid.UUID) (*catalog.Catalog, error)
	DeleteImage(ctx *fiber.Ctx, u uuid.UUID) (*catalog.ImageCatalog, error)
	FindByAlias(ctx *fiber.Ctx, alias string) (*catalog.Catalog, error)
	FindByUuid(ctx *fiber.Ctx, u uuid.UUID) (*catalog.Catalog, error)
	FindByUuidImage(ctx *fiber.Ctx, u uuid.UUID) (*catalog.ImageCatalog, error)
	SelectDictList(ctx *fiber.Ctx) ([]*catalog.DictCatalog, error)
	SelectList(ctx *fiber.Ctx, qp *catalog.QueryParamsCatalogList) (*catalog.ListCatalogResponse, error)
	SelectListImage(cf *fiber.Ctx, catalogId int) ([]*catalog.ImageCatalog, error)
	Update(ctx *fiber.Ctx, c *catalog.Catalog) (*catalog.Catalog, error)
}
