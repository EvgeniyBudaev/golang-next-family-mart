package catalog

import (
	"context"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/catalog"
)

type ICatalogStore interface {
	Create(ctx context.Context, catalog *catalog.Catalog) (*catalog.Catalog, error)
	SelectAll(ctx context.Context) ([]*catalog.Catalog, error)
}
