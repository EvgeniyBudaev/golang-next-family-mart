package catalog

import (
	"context"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/catalog"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"go.uber.org/zap"
)

type GetCatalogListUseCase struct {
	dataStore ICatalogStore
}

func NewGetCatalogListUseCase(ds ICatalogStore) *GetCatalogListUseCase {
	return &GetCatalogListUseCase{
		dataStore: ds,
	}
}

func (uc *GetCatalogListUseCase) GetCatalogList(ctx context.Context) ([]*catalog.Catalog, error) {
	response, err := uc.dataStore.SelectAll(ctx)
	if err != nil {
		logger.Log.Debug("error while GetCatalogList. error in method SelectAll", zap.Error(err))
		return nil, err
	}
	return response, nil
}
