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

type IUpdateSelectableUseCase interface {
	UpdateSelectable(ctx *fiber.Ctx, request selectableUseCase.UpdateSelectableRequest) (*selectable.Selectable, error)
}

func UpdateSelectableHandler(uc IUpdateSelectableUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("update to Selectable PUT /api/v1/selectable/update")
		var request = selectableUseCase.UpdateSelectableRequest{}
		err := ctx.BodyParser(&request)
		if err != nil {
			logger.Log.Debug("error while UpdateSelectableHandler. Error in BodyParser", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		response, err := uc.UpdateSelectable(ctx, request)
		if err != nil {
			logger.Log.Debug("error while UpdateSelectableHandler. Error in UpdateSelectable", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapCreated(ctx, response)
	}
}
