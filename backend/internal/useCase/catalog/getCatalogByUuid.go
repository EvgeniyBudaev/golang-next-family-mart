package catalog

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/catalog"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
)

type GetCatalogByUuidUseCase struct {
	dataStore ICatalogStore
}

func NewGetCatalogByUuidUseCase(ds ICatalogStore) *GetCatalogByUuidUseCase {
	return &GetCatalogByUuidUseCase{
		dataStore: ds,
	}
}

func (uc *GetCatalogByUuidUseCase) GetCatalogByUuid(ctx *fiber.Ctx) (*catalog.Catalog, error) {
	params := ctx.Params("uuid")
	response, err := uc.dataStore.FindByUuid(ctx, params)
	if err != nil {
		logger.Log.Debug("error while GetCatalogByUuid. error in method FindByUuid", zap.Error(err))
		return nil, err
	}
	return response, nil
}
