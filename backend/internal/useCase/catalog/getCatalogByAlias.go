package catalog

import (
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/catalog"
	errorDomain "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/error"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type GetCatalogByAliasUseCase struct {
	dataStore ICatalogStore
}

func NewGetCatalogByAliasUseCase(ds ICatalogStore) *GetCatalogByAliasUseCase {
	return &GetCatalogByAliasUseCase{
		dataStore: ds,
	}
}

func (uc *GetCatalogByAliasUseCase) GetCatalogByAlias(ctx *fiber.Ctx) (*catalog.Catalog, error) {
	params := ctx.Params("alias")
	response, err := uc.dataStore.FindByAlias(ctx, params)
	if err != nil {
		logger.Log.Debug("error while GetCatalogByAlias. error in method FindByAlias", zap.Error(err))
		return nil, err
	}
	if response.IsDeleted == true {
		msg := fmt.Errorf("catalog has already been deleted")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	return response, nil
}
