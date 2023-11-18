package catalog

import (
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/catalog"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"strings"
	"time"
)

type UpdateCatalogRequest struct {
	Alias   string    `json:"alias"`
	Deleted bool      `json:"deleted"`
	Enabled bool      `json:"enabled"`
	Image   string    `json:"image"`
	Name    string    `json:"name"`
	Uuid    uuid.UUID `json:"uuid"`
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
	fmt.Println("catalogInDB: ", catalogInDB)
	var request = &catalog.Catalog{
		Id:        catalogInDB.Id,
		Alias:     strings.ToLower(r.Alias),
		CreatedAt: catalogInDB.CreatedAt,
		Deleted:   r.Deleted,
		Enabled:   r.Enabled,
		Image:     r.Image,
		Name:      strings.ToLower(r.Name),
		UpdatedAt: time.Now(),
		Uuid:      r.Uuid,
	}
	response, err := uc.dataStore.Update(ctx, request)
	if err != nil {
		logger.Log.Debug("error while UpdateCatalog. error in method Update", zap.Error(err))
		return nil, err
	}
	return response, nil
}
