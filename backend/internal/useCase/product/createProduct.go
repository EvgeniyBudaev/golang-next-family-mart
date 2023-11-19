package product

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/product"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"time"
)

type CreateProductRequest struct {
	Alias        string `json:"alias"`
	CatalogAlias string `json:"catalog_alias"`
	Name         string `json:"name"`
}

type CreateProductUseCase struct {
	dataStore IProductStore
}

func NewCreateProductUseCase(ds IProductStore) *CreateProductUseCase {
	return &CreateProductUseCase{
		dataStore: ds,
	}
}

func (uc *CreateProductUseCase) CreateProduct(ctx *fiber.Ctx, r CreateProductRequest) (*product.Product, error) {
	var request = &product.Product{
		Alias:        r.Alias,
		CatalogAlias: r.CatalogAlias,
		CreatedAt:    time.Now(),
		Deleted:      false,
		Enabled:      true,
		Image:        "",
		Name:         r.Name,
		UpdatedAt:    time.Now(),
		Uuid:         uuid.New(),
	}
	response, err := uc.dataStore.Create(ctx, request)
	if err != nil {
		logger.Log.Debug("error while CreateProduct. error in method Create", zap.Error(err))
		return nil, err
	}
	return response, nil
}
