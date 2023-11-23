package catalog

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/catalog"
	r "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/response"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type IGetCatalogByAliasUseCase interface {
	GetCatalogByAlias(ctx *fiber.Ctx) (*catalog.Catalog, error)
}

func GetCatalogByAliasHandler(uc IGetCatalogByAliasUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("get catalog by alias GET /api/v1/catalog/:alias")
		response, err := uc.GetCatalogByAlias(ctx)
		if err != nil {
			logger.Log.Debug("error while GetCatalogByAliasHandler. Error in GetCatalogByAlias", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapOk(ctx, response)
	}
}
