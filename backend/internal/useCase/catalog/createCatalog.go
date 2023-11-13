package catalog

import (
	"context"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/catalog"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"time"
)

type CreateCatalogRequest struct {
	Alias string `json:"alias"`
	Name  string `json:"name"`
}

type CreateCatalogUseCase struct {
	dataStore ICatalogStore
}

func NewCreateCatalogUseCase(ds ICatalogStore) *CreateCatalogUseCase {
	return &CreateCatalogUseCase{
		dataStore: ds,
	}
}

func (uc *CreateCatalogUseCase) CreateCatalog(ctx context.Context, r CreateCatalogRequest) (*catalog.Catalog, error) {
	var request = &catalog.Catalog{
		Alias:     r.Alias,
		CreatedAt: time.Now(),
		Name:      r.Name,
		Uuid:      uuid.New(),
	}
	response, err := uc.dataStore.Create(ctx, request)
	if err != nil {
		logger.Log.Debug("error while CreateCatalog. error in method Create", zap.Error(err))
		return nil, err
	}
	return response, nil
}
