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

type IDeleteProductImageUseCase interface {
	DeleteProductImage(ctx *fiber.Ctx, request productUseCase.DeleteProductImageRequest) (*product.ImageProduct, error)
}

func DeleteProductImageHandler(uc IDeleteProductImageUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("post to product create DELETE /api/v1/product/image/delete")
		var request = productUseCase.DeleteProductImageRequest{}
		err := ctx.BodyParser(&request)
		if err != nil {
			logger.Log.Debug("error while DeleteProductImageHandler. Error in BodyParser", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		response, err := uc.DeleteProductImage(ctx, request)
		if err != nil {
			logger.Log.Debug("error while DeleteProductImageHandler. Error in Delete", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapCreated(ctx, response)
	}
}
