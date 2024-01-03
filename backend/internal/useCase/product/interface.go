package product

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/product"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type IProductStore interface {
	AddImage(ctx *fiber.Ctx, c *product.ImageProduct) (*product.ImageProduct, error)
	Create(ctx *fiber.Ctx, p *product.Product) (*product.Product, error)
	Delete(ctx *fiber.Ctx, p *product.Product) (*product.Product, error)
	DeleteImage(ctx *fiber.Ctx, u uuid.UUID) (*product.ImageProduct, error)
	FindByAlias(ctx *fiber.Ctx, alias string) (*product.Product, error)
	FindByUuid(ctx *fiber.Ctx, u uuid.UUID) (*product.Product, error)
	FindByUuidImage(ctx *fiber.Ctx, u uuid.UUID) (*product.ImageProduct, error)
	SelectList(ctx *fiber.Ctx, qp *product.QueryParamsProductList) (*product.ListProductResponse, error)
	SelectListImage(cf *fiber.Ctx, productId int) ([]*product.ImageProduct, error)
	Update(ctx *fiber.Ctx, c *product.Product) (*product.Product, error)
}
