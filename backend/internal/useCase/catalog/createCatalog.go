package catalog

import (
	"context"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/catalog"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"go.uber.org/zap"
)

type CreateCatalogRequest struct {
	Name string `json:"name"`
}

type CreateCatalogUseCase struct {
	dataStore ICatalogStore
}

func NewCreateCatalogUseCase(ds ICatalogStore) *CreateCatalogUseCase {
	return &CreateCatalogUseCase{
		dataStore: ds,
	}
}

func (uc *CreateCatalogUseCase) CreateCatalog(ctx context.Context, request CreateCatalogRequest) (*catalog.Catalog, error) {
	var catalogRequest = &catalog.Catalog{
		Name: request.Name,
	}
	newCatalog, err := uc.dataStore.Create(ctx, catalogRequest)
	if err != nil {
		logger.Log.Debug(
			"error while CreateCatalog. error in method Create",
			zap.Error(err))
		return nil, err
	}
	return newCatalog, nil
}
