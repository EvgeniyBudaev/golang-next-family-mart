package selectable

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/selectable"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

type GetSelectableListUseCase struct {
	dataStore ISelectableStore
}

func NewGetSelectableListUseCase(ds ISelectableStore) *GetSelectableListUseCase {
	return &GetSelectableListUseCase{
		dataStore: ds,
	}
}

func (uc *GetSelectableListUseCase) GetSelectableList(ctx *fiber.Ctx) (*selectable.ListSelectableResponse, error) {
	var params selectable.QueryParamsSelectableList
	if err := ctx.QueryParser(&params); err != nil {
		logger.Log.Debug("error while GetSelectableList. error in method QueryParser", zap.Error(err))
		return nil, err
	}
	response, err := uc.dataStore.SelectList(ctx, &params)
	if err != nil {
		logger.Log.Debug("error while GetSelectableList. error in method SelectAll", zap.Error(err))
		return nil, err
	}
	return response, nil
}
