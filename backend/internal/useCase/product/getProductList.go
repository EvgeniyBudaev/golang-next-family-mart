package product

import (
	"context"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/product"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"go.uber.org/zap"
)

type GetProductListUseCase struct {
	dataStore IProductStore
}

func NewGetProductListUseCase(ds IProductStore) *GetProductListUseCase {
	return &GetProductListUseCase{
		dataStore: ds,
	}
}

func (uc *GetProductListUseCase) GetProductList(ctx context.Context) ([]*product.Product, error) {
	response, err := uc.dataStore.SelectAll(ctx)
	if err != nil {
		logger.Log.Debug("error while GetProductList. error in method SelectAll", zap.Error(err))
		return nil, err
	}
	return response, nil
}
