package product

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/product"
	r "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/response"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	productUseCase "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/useCase/product"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type IUpdateProductUseCase interface {
	UpdateProduct(ctx *fiber.Ctx, request productUseCase.UpdateProductRequest) (*product.Product, error)
}

func UpdateProductHandler(uc IUpdateProductUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("post to product create POST /api/v1/product/update")
		var request = productUseCase.UpdateProductRequest{}
		err := ctx.BodyParser(&request)
		if err != nil {
			logger.Log.Debug("error while UpdateProductHandler. Error in BodyParser", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		response, err := uc.UpdateProduct(ctx, request)
		if err != nil {
			logger.Log.Debug("error while UpdateProductHandler. Error in UpdateProduct", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapCreated(ctx, response)
	}
}
