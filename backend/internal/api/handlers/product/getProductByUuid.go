package product

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/product"
	r "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/response"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type IGetProductByUuidUseCase interface {
	GetProductByUuid(ctx *fiber.Ctx) (*product.Product, error)
}

func GetProductByUuidHandler(uc IGetProductByUuidUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("get catalog by alias GET /api/v1/product/uuid/:uuid")
		response, err := uc.GetProductByUuid(ctx)
		if err != nil {
			logger.Log.Debug("error while GetProductByUuidHandler. Error in GetProductByUuid", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapOk(ctx, response)
	}
}
