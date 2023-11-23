package product

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/product"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

type GetProductByAliasUseCase struct {
	dataStore IProductStore
}

func NewGetProductByAliasUseCase(ds IProductStore) *GetProductByAliasUseCase {
	return &GetProductByAliasUseCase{
		dataStore: ds,
	}
}

func (uc *GetProductByAliasUseCase) GetProductByAlias(ctx *fiber.Ctx) (*product.Product, error) {
	params := ctx.Params("alias")
	response, err := uc.dataStore.FindByAlias(ctx, params)
	if err != nil {
		logger.Log.Debug("error while GetProductByAlias. error in method FindByAlias", zap.Error(err))
		return nil, err
	}
	return response, nil
}
