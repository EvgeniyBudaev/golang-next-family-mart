package catalog

import (
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/catalog"
	errorDomain "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/error"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"net/http"
	"strings"
	"time"
)

type UpdateCatalogRequest struct {
	Uuid  uuid.UUID `json:"uuid"`
	Alias string    `json:"alias"`
	Name  string    `json:"name"`
	Image []byte    `json:"image"`
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
	directoryPath := "static/uploads/catalog/image"
	filePath := fmt.Sprintf("%s/defaultImage.jpg", directoryPath)
	form, err := ctx.MultipartForm()
	if err != nil {
		logger.Log.Debug("error while UpdateCatalog. error FormFile", zap.Error(err))
		return nil, err
	}
	imageFiles := form.File["image"]
	imagesFilePath := make([]string, 0, len(imageFiles))
	imagesCatalog := make([]*catalog.ImageCatalog, 0, len(imagesFilePath))
	for _, file := range imageFiles {
		filePath = fmt.Sprintf("%s/%s", directoryPath, file.Filename)
		if err := ctx.SaveFile(file, filePath); err != nil {
			logger.Log.Debug("error while UpdateCatalog. error SaveFile", zap.Error(err))
			return nil, err
		}
		image := catalog.ImageCatalog{
			Uuid:      uuid.New(),
			Name:      file.Filename,
			Url:       filePath,
			Size:      file.Size,
			CreatedAt: time.Now(),
			UpdatedAt: time.Now(),
			IsDeleted: false,
			IsEnabled: true,
		}
		imagesFilePath = append(imagesFilePath, filePath)
		imagesCatalog = append(imagesCatalog, &image)
	}
	catalogRequest := &catalog.Catalog{
		Uuid:      r.Uuid,
		Alias:     strings.ToLower(r.Alias),
		Name:      r.Name,
		CreatedAt: catalogInDB.CreatedAt,
		UpdatedAt: time.Now(),
		IsDeleted: false,
		IsEnabled: true,
		Images:    imagesCatalog,
	}
	updatedCatalog, err := uc.dataStore.Update(ctx, catalogRequest)
	if err != nil {
		logger.Log.Debug("error while UpdateCatalog. error in method Update", zap.Error(err))
		return nil, err
	}
	for _, i := range catalogRequest.Images {
		image := &catalog.ImageCatalog{
			CatalogId: catalogInDB.Id,
			Uuid:      i.Uuid,
			Name:      i.Name,
			Url:       i.Url,
			Size:      i.Size,
			CreatedAt: i.CreatedAt,
			UpdatedAt: i.UpdatedAt,
			IsDeleted: i.IsDeleted,
			IsEnabled: i.IsEnabled,
		}
		_, err := uc.dataStore.AddImage(ctx, image)
		if err != nil {
			logger.Log.Debug("error while UpdateCatalog. error in method AddImage", zap.Error(err))
			return nil, err
		}
	}
	response, err := uc.dataStore.FindByUuid(ctx, updatedCatalog.Uuid)
	if err != nil {
		logger.Log.Debug("error while UpdateCatalog. error in method FindByUuid", zap.Error(err))
		return nil, err
	}
	return response, nil
}
