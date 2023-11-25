package attribute

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/attribute"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

type GetAttributeListUseCase struct {
	dataStore IAttributeStore
}

func NewGetAttributeListUseCase(ds IAttributeStore) *GetAttributeListUseCase {
	return &GetAttributeListUseCase{
		dataStore: ds,
	}
}

func (uc *GetAttributeListUseCase) GetAttributeList(ctx *fiber.Ctx) (*attribute.ListAttributeResponse, error) {
	var params attribute.QueryParamsAttributeList
	if err := ctx.QueryParser(&params); err != nil {
		logger.Log.Debug("error while GetAttributeList. error in method QueryParser", zap.Error(err))
		return nil, err
	}
	response, err := uc.dataStore.SelectList(ctx, &params)
	if err != nil {
		logger.Log.Debug("error while GetAttributeList. error in method SelectAll", zap.Error(err))
		return nil, err
	}
	return response, nil
}
