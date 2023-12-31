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
	"os"
)

type DeleteCatalogImageRequest struct {
	Uuid uuid.UUID `json:"uuid"`
}

type DeleteCatalogImageUseCase struct {
	dataStore ICatalogStore
}

func NewDeleteCatalogImageUseCase(ds ICatalogStore) *DeleteCatalogImageUseCase {
	return &DeleteCatalogImageUseCase{
		dataStore: ds,
	}
}

func (uc *DeleteCatalogImageUseCase) DeleteCatalogImage(ctx *fiber.Ctx, r DeleteCatalogImageRequest) (*catalog.ImageCatalog, error) {
	imageInDB, err := uc.dataStore.FindByUuidImage(ctx, r.Uuid)
	if err != nil {
		logger.Log.Debug("error while DeleteCatalogImage. error in method FindByUuid", zap.Error(err))
		return nil, err
	}
	if imageInDB.IsDeleted == true {
		msg := errors.Wrap(err, "image has already been deleted")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	filePath := imageInDB.Url
	if err := os.Remove(filePath); err != nil {
		logger.Log.Debug("error while DeleteCatalogImage. error while deleting file", zap.Error(err))
		return nil, err
	}
	response, err := uc.dataStore.DeleteImage(ctx, r.Uuid)
	if err != nil {
		logger.Log.Debug("error while DeleteImage. error in method Delete", zap.Error(err))
		return nil, err
	}
	return response, nil
}
