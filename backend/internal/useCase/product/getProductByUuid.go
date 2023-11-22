package product

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/product"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

type GetProductByUuidUseCase struct {
	dataStore IProductStore
}

func NewGetProductByUuidUseCase(ds IProductStore) *GetProductByUuidUseCase {
	return &GetProductByUuidUseCase{
		dataStore: ds,
	}
}

func (uc *GetProductByUuidUseCase) GetProductByUuid(ctx *fiber.Ctx) (*product.Product, error) {
	params := ctx.Params("uuid")
	response, err := uc.dataStore.FindByUuid(ctx, params)
	if err != nil {
		logger.Log.Debug("error while GetProductByUuid. error in method FindByUuid", zap.Error(err))
		return nil, err
	}
	return response, nil
}
