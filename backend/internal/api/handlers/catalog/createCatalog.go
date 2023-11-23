package catalog

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/catalog"
	r "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/response"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	catalogUseCase "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/useCase/catalog"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type ICreateCatalogUseCase interface {
	CreateCatalog(ctx *fiber.Ctx, request catalogUseCase.CreateCatalogRequest) (*catalog.Catalog, error)
}

func CreateCatalogHandler(uc ICreateCatalogUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("post to catalog create POST /api/v1/catalog/create")
		var request = catalogUseCase.CreateCatalogRequest{}
		err := ctx.BodyParser(&request)
		if err != nil {
			logger.Log.Debug("error while CreateCatalogHandler. Error in BodyParser", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		response, err := uc.CreateCatalog(ctx, request)
		if err != nil {
			logger.Log.Debug("error while CreateCatalogHandler. Error in CreateCatalog", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapCreated(ctx, response)
	}
}
