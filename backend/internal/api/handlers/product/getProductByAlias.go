package product

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/product"
	r "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/response"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type IGetProductByAliasUseCase interface {
	GetProductByAlias(ctx *fiber.Ctx) (*product.Product, error)
}

func GetProductByAliasHandler(uc IGetProductByAliasUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("get catalog by alias GET /api/v1/product/:alias")
		response, err := uc.GetProductByAlias(ctx)
		if err != nil {
			logger.Log.Debug("error while GetProductByAliasHandler. Error in GetProductByAlias", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapOk(ctx, response)
	}
}
