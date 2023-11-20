package catalog

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/catalog"
	r "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/response"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type IGetCatalogByUuidUseCase interface {
	GetCatalogByUuid(ctx *fiber.Ctx) (*catalog.Catalog, error)
}

func GetCatalogByUuidHandler(uc IGetCatalogByUuidUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("get catalog by uuid GET /api/v1/catalog/:uuid")
		response, err := uc.GetCatalogByUuid(ctx)
		if err != nil {
			logger.Log.Debug("error while GetCatalogByUuidHandler. Error in GetCatalogByUuid", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapOk(ctx, response)
	}
}
