package attribute

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/attribute"
	r "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/response"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type IGetAttributeListUseCase interface {
	GetAttributeList(ctx *fiber.Ctx) (*attribute.ListAttributeResponse, error)
}

func GetAttributeListHandler(uc IGetAttributeListUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("get attribute list GET /api/v1/attribute/list")
		response, err := uc.GetAttributeList(ctx)
		if err != nil {
			logger.Log.Debug("error while GetAttributeListHandler. Error in GetAttributeList", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapOk(ctx, response)
	}
}
