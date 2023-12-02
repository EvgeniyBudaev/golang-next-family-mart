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

type IDeleteAttributeUseCase interface {
	DeleteAttribute(ctx *fiber.Ctx, request attributeUseCase.DeleteAttributeRequest) (*attribute.Attribute, error)
}

func DeleteAttributeHandler(uc IDeleteAttributeUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("delete to attribute DELETE /api/v1/attribute/delete")
		var request = attributeUseCase.DeleteAttributeRequest{}
		err := ctx.BodyParser(&request)
		if err != nil {
			logger.Log.Debug("error while DeleteAttributeHandler. Error in BodyParser", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		response, err := uc.DeleteAttribute(ctx, request)
		if err != nil {
			logger.Log.Debug("error while DeleteAttributeHandler. Error in DeleteAttribute", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapCreated(ctx, response)
	}
}
