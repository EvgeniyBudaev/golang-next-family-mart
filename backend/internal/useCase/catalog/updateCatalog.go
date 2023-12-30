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
)

type UpdateCatalogRequest struct {
	Uuid         uuid.UUID `json:"uuid"`
	Alias        string    `json:"alias"`
	Name         string    `json:"name"`
	DefaultImage []byte    `json:"defaultImage"`
	Image        []byte    `json:"image"`
}

type UpdateCatalogUseCase struct {
	dataStore ICatalogStore
}

func NewUpdateCatalogUseCase(ds ICatalogStore) *UpdateCatalogUseCase {
	return &UpdateCatalogUseCase{
		dataStore: ds,
	}
}

func (uc *UpdateCatalogUseCase) UpdateCatalog(ctx *fiber.Ctx, r UpdateCatalogRequest) (*catalog.Catalog, error) {
	catalogInDB, err := uc.dataStore.FindByUuid(ctx, r.Uuid)
	if err != nil {
		logger.Log.Debug("error while UpdateCatalog. error in method FindByUuid", zap.Error(err))
		return nil, err
	}
	if catalogInDB.IsDeleted == true {
		msg := errors.Wrap(err, "catalog has already been deleted")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	//var request = &catalog.Catalog{
	//	Id:        catalogInDB.Id,
	//	Uuid:      r.Uuid,
	//	Alias:     strings.ToLower(r.Alias),
	//	Name:      strings.ToLower(r.Name),
	//	CreatedAt: catalogInDB.CreatedAt,
	//	UpdatedAt: time.Now(),
	//	IsDeleted: catalogInDB.IsDeleted,
	//	IsEnabled: r.IsEnabled,
	//	//Image:     r.Image,
	//}
	//response, err := uc.dataStore.Update(ctx, request)
	//if err != nil {
	//	logger.Log.Debug("error while UpdateCatalog. error in method Update", zap.Error(err))
	//	return nil, err
	//}
	//return response, nil
	return nil, nil
}
