package catalog

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/catalog"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

type GetCatalogListUseCase struct {
	dataStore ICatalogStore
}

func NewGetCatalogListUseCase(ds ICatalogStore) *GetCatalogListUseCase {
	return &GetCatalogListUseCase{
		dataStore: ds,
	}
}

func (uc *GetCatalogListUseCase) GetCatalogList(ctx *fiber.Ctx) (*catalog.ListCatalogResponse, error) {
	var params catalog.QueryParamsCatalogList
	if err := ctx.QueryParser(&params); err != nil {
		logger.Log.Debug("error while GetCatalogList. error in method QueryParser", zap.Error(err))
		return nil, err
	}
	response, err := uc.dataStore.SelectList(ctx, &params)
	if err != nil {
		logger.Log.Debug("error while GetCatalogList. error in method SelectAll", zap.Error(err))
		return nil, err
	}
	return response, nil
}
