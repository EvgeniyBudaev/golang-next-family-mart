package product

import (
	"context"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/product"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"go.uber.org/zap"
)

type CreateProductRequest struct {
	Alias        string `json:"alias"`
	CatalogAlias string `json:"catalog_alias"`
	Name         string `json:"name"`
}

type CreateProductUseCase struct {
	dataStore IProductStore
}

func NewCreateProductUseCase(ds IProductStore) *CreateProductUseCase {
	return &CreateProductUseCase{
		dataStore: ds,
	}
}

func (uc *CreateProductUseCase) CreateProduct(ctx context.Context, r CreateProductRequest) (*product.Product, error) {
	var request = &product.Product{
		Alias:        r.Alias,
		CatalogAlias: r.CatalogAlias,
		Name:         r.Name,
	}
	response, err := uc.dataStore.Create(ctx, request)
	if err != nil {
		logger.Log.Debug("error while CreateProduct. error in method Create", zap.Error(err))
		return nil, err
	}
	return response, nil
}
