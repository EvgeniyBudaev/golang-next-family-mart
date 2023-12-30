package catalog

import (
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/catalog"
	errorDomain "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/error"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"net/http"
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
	paramsStr, err := uuid.Parse(params)
	if err != nil {
		logger.Log.Debug("error while parsing UUID", zap.Error(err))
		return nil, err
	}
	response, err := uc.dataStore.FindByUuid(ctx, paramsStr)
	if err != nil {
		logger.Log.Debug("error while GetCatalogByUuid. error in method FindByUuid", zap.Error(err))
		return nil, err
	}
	if response.IsDeleted == true {
		msg := fmt.Errorf("catalog has already been deleted")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	return response, nil
}
