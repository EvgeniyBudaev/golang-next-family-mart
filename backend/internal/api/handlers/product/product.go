package product

import (
	"context"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/product"
	r "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/response"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	productUseCase "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/useCase/product"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type ICreateProductUseCase interface {
	CreateProduct(ctx context.Context, request productUseCase.CreateProductRequest) (*product.Product, error)
}

type IGetProductListUseCase interface {
	GetProductList(ctx context.Context) ([]*product.Product, error)
}

func PostProductCreateHandler(uc ICreateProductUseCase) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var ctx = c.UserContext()
		logger.Log.Info("post to product create POST /api/v1/product/create")
		var request = productUseCase.CreateProductRequest{}
		err := c.BodyParser(&request)
		if err != nil {
			logger.Log.Debug("error while PostProductCreateHandler. Error in BodyParser", zap.Error(err))
			return r.WrapError(c, err, http.StatusBadRequest)
		}
		response, err := uc.CreateProduct(ctx, request)
		if err != nil {
			logger.Log.Debug("error while PostProductCreateHandler. Error in CreateProduct", zap.Error(err))
			return r.WrapError(c, err, http.StatusBadRequest)
		}
		return r.WrapCreated(c, response)
	}
}

func GetProductListHandler(uc IGetProductListUseCase) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var ctx = c.UserContext()
		logger.Log.Info("get product list GET /api/v1/product/list")
		response, err := uc.GetProductList(ctx)
		if err != nil {
			logger.Log.Debug("error while GetProductListHandler. Error in GetProductList", zap.Error(err))
			return r.WrapError(c, err, http.StatusBadRequest)
		}
		return r.WrapOk(c, response)
	}
}
