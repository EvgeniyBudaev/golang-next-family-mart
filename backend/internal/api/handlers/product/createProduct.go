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

type ICreateProductUseCase interface {
	CreateProduct(ctx *fiber.Ctx, request productUseCase.CreateProductRequest) (*product.Product, error)
}

func CreateProductHandler(uc ICreateProductUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("post to product create POST /api/v1/product/create")
		var request = productUseCase.CreateProductRequest{}
		err := ctx.BodyParser(&request)
		if err != nil {
			logger.Log.Debug("error while PostProductCreateHandler. Error in BodyParser", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		response, err := uc.CreateProduct(ctx, request)
		if err != nil {
			logger.Log.Debug("error while PostProductCreateHandler. Error in CreateProduct", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapCreated(ctx, response)
	}
}
