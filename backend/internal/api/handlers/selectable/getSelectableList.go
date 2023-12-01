package selectable

import (
	r "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/response"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/selectable"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type IGetSelectableListUseCase interface {
	GetSelectableList(ctx *fiber.Ctx) (*selectable.ListSelectableResponse, error)
}

func GetSelectableListHandler(uc IGetSelectableListUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("get selectable list GET /api/v1/selectable/list")
		response, err := uc.GetSelectableList(ctx)
		if err != nil {
			logger.Log.Debug("error while GetSelectableListHandler. Error in GetSelectableList", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapOk(ctx, response)
	}
}
