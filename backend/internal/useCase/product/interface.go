package product

import (
	"context"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/product"
)

type IProductStore interface {
	Create(ctx context.Context, catalog *product.Product) (*product.Product, error)
	SelectAll(ctx context.Context) ([]*product.Product, error)
}
