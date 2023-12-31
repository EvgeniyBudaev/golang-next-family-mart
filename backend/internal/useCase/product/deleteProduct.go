package product

import (
	errorDomain "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/error"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/product"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"net/http"
	"strings"
	"time"
)

type DeleteProductRequest struct {
	Uuid uuid.UUID `json:"uuid"`
}

type DeleteProductUseCase struct {
	dataStore IProductStore
}

func NewDeleteProductUseCase(ds IProductStore) *DeleteProductUseCase {
	return &DeleteProductUseCase{
		dataStore: ds,
	}
}

func (uc *DeleteProductUseCase) DeleteProduct(ctx *fiber.Ctx, r DeleteProductRequest) (*product.Product, error) {
	productInDB, err := uc.dataStore.FindByUuid(ctx, r.Uuid)
	if err != nil {
		logger.Log.Debug("error while DeleteProduct. error in method FindByUuid", zap.Error(err))
		msg := errors.Wrap(err, "product not found")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	if productInDB.IsDeleted == true {
		msg := errors.Wrap(err, "product has already been deleted")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	request := &product.Product{
		Id:           productInDB.Id,
		CatalogId:    productInDB.CatalogId,
		Uuid:         r.Uuid,
		Alias:        strings.ToLower(productInDB.Alias),
		Name:         productInDB.Name,
		CreatedAt:    productInDB.CreatedAt,
		UpdatedAt:    time.Now(),
		IsDeleted:    false,
		IsEnabled:    productInDB.IsEnabled,
		CatalogAlias: productInDB.CatalogAlias,
	}
	response, err := uc.dataStore.Delete(ctx, request)
	if err != nil {
		logger.Log.Debug("error while DeleteProduct. error in method Delete", zap.Error(err))
		return nil, err
	}
	return response, nil
}
