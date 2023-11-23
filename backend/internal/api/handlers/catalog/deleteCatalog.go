package catalog

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/catalog"
	r "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/response"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type IDeleteCatalogUseCase interface {
	DeleteCatalog(ctx *fiber.Ctx) (*catalog.Catalog, error)
}

func DeleteCatalogHandler(uc IDeleteCatalogUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("post to catalog create DELETE /api/v1/catalog/delete/:uuid")
		response, err := uc.DeleteCatalog(ctx)
		if err != nil {
			logger.Log.Debug("error while DeleteCatalogHandler(. Error in Delete", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapOk(ctx, response)
	}
}
