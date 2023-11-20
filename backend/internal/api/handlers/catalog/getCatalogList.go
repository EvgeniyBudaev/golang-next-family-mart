package catalog

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/catalog"
	r "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/response"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type IGetCatalogListUseCase interface {
	GetCatalogList(ctx *fiber.Ctx) (*catalog.ListCatalogResponse, error)
}

func GetCatalogListHandler(uc IGetCatalogListUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("get catalog list GET /api/v1/catalog/list")
		response, err := uc.GetCatalogList(ctx)
		if err != nil {
			logger.Log.Debug("error while GetCatalogListHandler. Error in GetCatalogList", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapOk(ctx, response)
	}
}
