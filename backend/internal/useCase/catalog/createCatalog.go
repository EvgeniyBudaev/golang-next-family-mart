package catalog

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/catalog"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"strings"
	"time"
)

type CreateCatalogRequest struct {
	Alias string `json:"alias"`
	Name  string `json:"name"`
}

type CreateCatalogUseCase struct {
	dataStore ICatalogStore
}

func NewCreateCatalogUseCase(ds ICatalogStore) *CreateCatalogUseCase {
	return &CreateCatalogUseCase{
		dataStore: ds,
	}
}

func (uc *CreateCatalogUseCase) CreateCatalog(ctx *fiber.Ctx, r CreateCatalogRequest) (*catalog.Catalog, error) {
	var request = &catalog.Catalog{
		Alias:     strings.ToLower(r.Alias),
		CreatedAt: time.Now(),
		Deleted:   false,
		Enabled:   true,
		Image:     "",
		Name:      strings.ToLower(r.Name),
		UpdatedAt: time.Now(),
		Uuid:      uuid.New(),
	}
	response, err := uc.dataStore.Create(ctx, request)
	if err != nil {
		logger.Log.Debug("error while CreateCatalog. error in method Create", zap.Error(err))
		return nil, err
	}
	return response, nil
}
