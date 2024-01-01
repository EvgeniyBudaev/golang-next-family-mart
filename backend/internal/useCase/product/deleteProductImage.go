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
	"os"
)

type DeleteProductImageRequest struct {
	Uuid uuid.UUID `json:"uuid"`
}

type DeleteProductImageUseCase struct {
	dataStore IProductStore
}

func NewDeleteProductImageUseCase(ds IProductStore) *DeleteProductImageUseCase {
	return &DeleteProductImageUseCase{
		dataStore: ds,
	}
}

func (uc *DeleteProductImageUseCase) DeleteProductImage(ctx *fiber.Ctx, r DeleteProductImageRequest) (*product.ImageProduct, error) {
	imageInDB, err := uc.dataStore.FindByUuidImage(ctx, r.Uuid)
	if err != nil {
		logger.Log.Debug("error while DeleteProductImage. error in method FindByUuid", zap.Error(err))
		return nil, err
	}
	if imageInDB.IsDeleted == true {
		msg := errors.Wrap(err, "image has already been deleted")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	filePath := imageInDB.Url
	if err := os.Remove(filePath); err != nil {
		logger.Log.Debug("error while DeleteProductImage. error while deleting file", zap.Error(err))
		return nil, err
	}
	response, err := uc.dataStore.DeleteImage(ctx, r.Uuid)
	if err != nil {
		logger.Log.Debug("error while DeleteImage. error in method Delete", zap.Error(err))
		return nil, err
	}
	return response, nil
}
