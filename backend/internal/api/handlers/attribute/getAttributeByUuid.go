package attribute

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/attribute"
	r "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/response"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type IGetAttributeByUuidUseCase interface {
	GetAttributeByUuid(ctx *fiber.Ctx) (*attribute.Attribute, error)
}

func GetAttributeByUuidHandler(uc IGetAttributeByUuidUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("get attribute by uuid GET /api/v1/attribute/uuid/:uuid")
		response, err := uc.GetAttributeByUuid(ctx)
		if err != nil {
			logger.Log.Debug("error while GetAttributeByUuidHandler. Error in GetAttributeByUuid", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapOk(ctx, response)
	}
}
