package product

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/product"
	r "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/response"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type IGetProductListUseCase interface {
	GetProductList(ctx *fiber.Ctx) (*product.ListProductResponse, error)
}

func GetProductListHandler(uc IGetProductListUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("get product list GET /api/v1/product/list")
		response, err := uc.GetProductList(ctx)
		if err != nil {
			logger.Log.Debug("error while GetProductListHandler. Error in GetProductList", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapOk(ctx, response)
	}
}
