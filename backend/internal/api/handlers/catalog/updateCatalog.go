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

type IUpdateCatalogUseCase interface {
	UpdateCatalog(ctx *fiber.Ctx, request catalogUseCase.UpdateCatalogRequest) (*catalog.Catalog, error)
}

func UpdateCatalogHandler(uc IUpdateCatalogUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("post to catalog create POST /api/v1/catalog/update")
		var request = catalogUseCase.UpdateCatalogRequest{}
		err := ctx.BodyParser(&request)
		if err != nil {
			logger.Log.Debug("error while UpdateCatalogHandler. Error in BodyParser", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		response, err := uc.UpdateCatalog(ctx, request)
		if err != nil {
			logger.Log.Debug("error while UpdateCatalogHandler. Error in UpdateCatalog", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapCreated(ctx, response)
	}
}
