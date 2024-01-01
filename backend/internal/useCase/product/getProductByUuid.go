package product

import (
	"fmt"
	errorDomain "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/error"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/product"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"net/http"
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
	paramsStr, err := uuid.Parse(params)
	if err != nil {
		logger.Log.Debug("error while parsing UUID", zap.Error(err))
		return nil, err
	}
	response, err := uc.dataStore.FindByUuid(ctx, paramsStr)
	if err != nil {
		logger.Log.Debug("error while GetProductByUuid. error in method FindByUuid", zap.Error(err))
		return nil, err
	}
	if response.IsDeleted == true {
		msg := fmt.Errorf("product has already been deleted")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	return response, nil
}
