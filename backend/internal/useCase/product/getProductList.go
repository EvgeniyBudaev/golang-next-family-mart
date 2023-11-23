package product

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/product"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
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

func (uc *GetProductListUseCase) GetProductList(ctx *fiber.Ctx) (*product.ListProductResponse, error) {
	var params product.QueryParamsProductList
	if err := ctx.QueryParser(&params); err != nil {
		logger.Log.Debug("error while GetProductList. error in method QueryParser", zap.Error(err))
		return nil, err
	}
	response, err := uc.dataStore.SelectList(ctx, &params)
	if err != nil {
		logger.Log.Debug("error while GetProductList. error in method SelectAll", zap.Error(err))
		return nil, err
	}
	return response, nil
}
