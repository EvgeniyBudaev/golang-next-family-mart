package selectable

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/selectable"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

type GetSelectableByUuidUseCase struct {
	dataStore ISelectableStore
}

func NewGetSelectableByUuidUseCase(ds ISelectableStore) *GetSelectableByUuidUseCase {
	return &GetSelectableByUuidUseCase{
		dataStore: ds,
	}
}

func (uc *GetSelectableByUuidUseCase) GetSelectableByUuid(ctx *fiber.Ctx) (*selectable.Selectable, error) {
	params := ctx.Params("uuid")
	paramsStr, err := uuid.Parse(params)
	if err != nil {
		logger.Log.Debug("error while parsing UUID", zap.Error(err))
		return nil, err
	}
	response, err := uc.dataStore.FindByUuid(ctx, paramsStr)
	if err != nil {
		logger.Log.Debug("error while GetSelectableByUuid. error in method FindByUuid", zap.Error(err))
		return nil, err
	}
	return response, nil
}
