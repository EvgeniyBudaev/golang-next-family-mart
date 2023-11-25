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

type ICreateAttributeUseCase interface {
	CreateAttribute(ctx *fiber.Ctx, request attributeUseCase.CreateAttributeRequest) (*attribute.Attribute, error)
}

func CreateAttributeHandler(uc ICreateAttributeUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("post to attribute create POST /api/v1/attribute/create")
		var request = attributeUseCase.CreateAttributeRequest{}
		err := ctx.BodyParser(&request)
		if err != nil {
			logger.Log.Debug("error while CreateAttributeHandler. Error in BodyParser", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		response, err := uc.CreateAttribute(ctx, request)
		if err != nil {
			logger.Log.Debug("error while CreateAttributeHandler. Error in CreateAttribute", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapCreated(ctx, response)
	}
}
