package product

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/product"
	"github.com/gofiber/fiber/v2"
)

type IProductStore interface {
	Create(ctx *fiber.Ctx, catalog *product.Product) (*product.Product, error)
	SelectList(ctx *fiber.Ctx, qp *product.QueryParamsProductList) (*product.ListProductResponse, error)
}
