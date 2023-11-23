package selectable

import (
	r "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/response"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/selectable"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	selectableUseCase "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/useCase/selectable"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type ICreateSelectableUseCase interface {
	CreateSelectable(ctx *fiber.Ctx, request selectableUseCase.CreateSelectableRequest) (*selectable.Selectable, error)
}

func CreateSelectableHandler(uc ICreateSelectableUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("post to attribute create POST /api/v1/selectable/create")
		var request = selectableUseCase.CreateSelectableRequest{}
		err := ctx.BodyParser(&request)
		if err != nil {
			logger.Log.Debug("error while CreateSelectableHandler. Error in BodyParser", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		response, err := uc.CreateSelectable(ctx, request)
		if err != nil {
			logger.Log.Debug("error while CreateSelectableHandler. Error in CreateAttribute", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapCreated(ctx, response)
	}
}
