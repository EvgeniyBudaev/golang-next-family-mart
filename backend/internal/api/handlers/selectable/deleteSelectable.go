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

type IDeleteSelectableUseCase interface {
	DeleteSelectable(ctx *fiber.Ctx, request selectableUseCase.DeleteSelectableRequest) (*selectable.Selectable, error)
}

func DeleteSelectableHandler(uc IDeleteSelectableUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("post to Selectable create DELETE /api/v1/selectable/update")
		var request = selectableUseCase.DeleteSelectableRequest{}
		err := ctx.BodyParser(&request)
		if err != nil {
			logger.Log.Debug("error while DeleteSelectableHandler. Error in BodyParser", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		response, err := uc.DeleteSelectable(ctx, request)
		if err != nil {
			logger.Log.Debug("error while DeleteSelectableHandler. Error in DeleteSelectable", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapCreated(ctx, response)
	}
}
