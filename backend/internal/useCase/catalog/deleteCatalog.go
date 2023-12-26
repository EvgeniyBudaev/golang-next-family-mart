package catalog

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/catalog"
	errorDomain "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/error"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"net/http"
	"time"
)

type DeleteCatalogRequest struct {
	Uuid uuid.UUID `json:"uuid"`
}

type DeleteCatalogUseCase struct {
	dataStore ICatalogStore
}

func NewDeleteCatalogUseCase(ds ICatalogStore) *DeleteCatalogUseCase {
	return &DeleteCatalogUseCase{
		dataStore: ds,
	}
}

func (uc *DeleteCatalogUseCase) DeleteCatalog(ctx *fiber.Ctx) (*catalog.Catalog, error) {
	params := ctx.Params("uuid")
	paramsStr, err := uuid.Parse(params)
	if err != nil {
		logger.Log.Debug("error while parsing UUID", zap.Error(err))
		return nil, err
	}
	catalogInDB, err := uc.dataStore.FindByUuid(ctx, paramsStr)
	if err != nil {
		logger.Log.Debug("error while DeleteCatalog. error in method FindByUuid", zap.Error(err))
		msg := errors.Wrap(err, "catalog not found")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	if catalogInDB.IsDeleted == true {
		msg := errors.Wrap(err, "catalog has already been deleted")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	var request = &catalog.Catalog{
		Id:        catalogInDB.Id,
		Uuid:      catalogInDB.Uuid,
		Alias:     catalogInDB.Alias,
		Name:      catalogInDB.Name,
		CreatedAt: catalogInDB.CreatedAt,
		UpdatedAt: time.Now(),
		IsDeleted: true,
		IsEnabled: catalogInDB.IsEnabled,
		Images:    catalogInDB.Images,
	}
	response, err := uc.dataStore.Delete(ctx, request)
	if err != nil {
		logger.Log.Debug("error while DeleteCatalog. error in method Delete", zap.Error(err))
		return nil, err
	}
	return response, nil
}
