package catalog

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/catalog"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

type GetDictCatalogListUseCase struct {
	dataStore ICatalogStore
}

func NewGetDictCatalogListUseCase(ds ICatalogStore) *GetDictCatalogListUseCase {
	return &GetDictCatalogListUseCase{
		dataStore: ds,
	}
}

func (uc *GetDictCatalogListUseCase) GetDictCatalogList(ctx *fiber.Ctx) ([]*catalog.DictCatalog, error) {
	var params catalog.QueryParamsCatalogList
	if err := ctx.QueryParser(&params); err != nil {
		logger.Log.Debug("error while GetDictCatalogList. error in method QueryParser", zap.Error(err))
		return nil, err
	}
	response, err := uc.dataStore.SelectDictList(ctx)
	if err != nil {
		logger.Log.Debug("error while GetCatalogList. error in method SelectAll", zap.Error(err))
		return nil, err
	}
	return response, nil
}
