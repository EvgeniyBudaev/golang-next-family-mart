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

type IDeleteProductUseCase interface {
	DeleteProduct(ctx *fiber.Ctx, request productUseCase.DeleteProductRequest) (*product.Product, error)
}

func DeleteProductHandler(uc IDeleteProductUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("delete to product delete DELETE /api/v1/product/delete/:uuid")
		var request = productUseCase.DeleteProductRequest{}
		err := ctx.BodyParser(&request)
		if err != nil {
			logger.Log.Debug("error while DeleteProductHandler. Error in BodyParser", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		response, err := uc.DeleteProduct(ctx, request)
		if err != nil {
			logger.Log.Debug("error while DeleteProductHandler. Error in Delete", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapOk(ctx, response)
	}
}
