package catalog

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/catalog"
	r "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/response"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type IGetDictCatalogListUseCase interface {
	GetDictCatalogList(ctx *fiber.Ctx) ([]*catalog.DictCatalog, error)
}

func GetDictCatalogListHandler(uc IGetDictCatalogListUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("get dict catalog list GET /api/v1/dict/catalog/list")
		response, err := uc.GetDictCatalogList(ctx)
		if err != nil {
			logger.Log.Debug("error while GetDictCatalogListHandler. Error in GetDictCatalogList", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapOk(ctx, response)
	}
}
