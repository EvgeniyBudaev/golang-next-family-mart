package attribute

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/attribute"
	r "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/response"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	attributeUseCase "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/useCase/attribute"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type IUpdateAttributeUseCase interface {
	UpdateAttribute(ctx *fiber.Ctx, request attributeUseCase.UpdateAttributeRequest) (*attribute.Attribute, error)
}

func UpdateAttributeHandler(uc IUpdateAttributeUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("post to catalog create POST /api/v1/attribute/update")
		var request = attributeUseCase.UpdateAttributeRequest{}
		err := ctx.BodyParser(&request)
		if err != nil {
			logger.Log.Debug("error while UpdateAttributeHandler. Error in BodyParser", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		response, err := uc.UpdateAttribute(ctx, request)
		if err != nil {
			logger.Log.Debug("error while UpdateAttributeHandler. Error in UpdateAttribute", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapCreated(ctx, response)
	}
}
