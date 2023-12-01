package selectable

import (
	r "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/response"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/selectable"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type IGetSelectableByUuidUseCase interface {
	GetSelectableByUuid(ctx *fiber.Ctx) (*selectable.Selectable, error)
}

func GetSelectableByUuidHandler(uc IGetSelectableByUuidUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("get selectable by uuid GET /api/v1/selectable/uuid/:uuid")
		response, err := uc.GetSelectableByUuid(ctx)
		if err != nil {
			logger.Log.Debug("error while GetSelectableByUuidHandler. Error in GetSelectableByUuid",
				zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapOk(ctx, response)
	}
}
