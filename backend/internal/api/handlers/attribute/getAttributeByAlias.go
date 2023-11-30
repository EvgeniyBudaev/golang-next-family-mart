package attribute

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/attribute"
	r "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/response"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type IGetAttributeByAliasUseCase interface {
	GetAttributeByAlias(ctx *fiber.Ctx) (*attribute.Attribute, error)
}

func GetAttributeByAliasHandler(uc IGetAttributeByAliasUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("get attribute by uuid GET /api/v1/attribute/alias/:alias")
		response, err := uc.GetAttributeByAlias(ctx)
		if err != nil {
			logger.Log.Debug("error while GetAttributeByAliasHandler. Error in GetAttributeByAlias",
				zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapOk(ctx, response)
	}
}
