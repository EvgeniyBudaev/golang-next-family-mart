package attribute

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/attribute"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

type GetAttributeByAliasUseCase struct {
	dataStore IAttributeStore
}

func NewGetAttributeByAliasUseCase(ds IAttributeStore) *GetAttributeByAliasUseCase {
	return &GetAttributeByAliasUseCase{
		dataStore: ds,
	}
}

func (uc *GetAttributeByAliasUseCase) GetAttributeByAlias(ctx *fiber.Ctx) (*attribute.Attribute, error) {
	params := ctx.Params("alias")
	response, err := uc.dataStore.FindByAlias(ctx, params)
	if err != nil {
		logger.Log.Debug("error while GetAttributeByAlias. error in method FindByUuid", zap.Error(err))
		return nil, err
	}
	return response, nil
}
