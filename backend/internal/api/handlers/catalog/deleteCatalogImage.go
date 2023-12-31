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

type IDeleteCatalogImageUseCase interface {
	DeleteCatalogImage(ctx *fiber.Ctx, request catalogUseCase.DeleteCatalogImageRequest) (*catalog.ImageCatalog, error)
}

func DeleteCatalogImageHandler(uc IDeleteCatalogImageUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("post to catalog create DELETE /api/v1/catalog/image/delete")
		var request = catalogUseCase.DeleteCatalogImageRequest{}
		err := ctx.BodyParser(&request)
		if err != nil {
			logger.Log.Debug("error while DeleteSelectableHandler. Error in BodyParser", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		response, err := uc.DeleteCatalogImage(ctx, request)
		if err != nil {
			logger.Log.Debug("error while DeleteCatalogImageHandler(. Error in Delete", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapCreated(ctx, response)
	}
}
