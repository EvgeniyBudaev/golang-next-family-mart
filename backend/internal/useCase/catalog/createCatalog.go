package catalog

import (
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/catalog"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"strings"
	"time"
)

type CreateCatalogRequest struct {
	Alias        string `json:"alias"`
	Name         string `json:"name"`
	DefaultImage []byte `json:"defaultImage"`
	Image        []byte `json:"image"`
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
	filePath := "./static/uploads/catalog/image/defaultImage.jpg"
	directoryPath := fmt.Sprintf("./static/uploads/catalog/image")
	form, err := ctx.MultipartForm()
	if err != nil {
		logger.Log.Debug("error while CreateCatalog. error FormFile", zap.Error(err))
		return nil, err
	}
	defaultImageFiles := form.File["defaultImage"]
	defaultImagePath := make([]string, 0, len(defaultImageFiles))
	defaultImagesCatalog := make([]*catalog.DefaultImageCatalog, 0, len(defaultImagePath))
	for _, file := range defaultImageFiles {
		filePath = fmt.Sprintf("%s/%s", directoryPath, file.Filename)
		if err := ctx.SaveFile(file, filePath); err != nil {
			logger.Log.Debug("error while CreateCatalog. error SaveFile", zap.Error(err))
			return nil, err
		}
		defaultImage := catalog.DefaultImageCatalog{Url: filePath}
		defaultImagePath = append(defaultImagePath, filePath)
		defaultImagesCatalog = append(defaultImagesCatalog, &defaultImage)
	}
	imageFiles := form.File["image"]
	imagesFilePath := make([]string, 0, len(imageFiles))
	imagesCatalog := make([]*catalog.ImageCatalog, 0, len(imagesFilePath))
	for _, file := range imageFiles {
		filePath = fmt.Sprintf("%s/%s", directoryPath, file.Filename)
		if err := ctx.SaveFile(file, filePath); err != nil {
			logger.Log.Debug("error while CreateCatalog. error SaveFile", zap.Error(err))
			return nil, err
		}
		image := catalog.ImageCatalog{Url: filePath}
		imagesFilePath = append(imagesFilePath, filePath)
		imagesCatalog = append(imagesCatalog, &image)
	}
	catalogRequest := &catalog.Catalog{
		Uuid:          uuid.New(),
		Alias:         strings.ToLower(r.Alias),
		Name:          strings.ToLower(r.Name),
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
		IsDeleted:     false,
		IsEnabled:     true,
		DefaultImages: defaultImagesCatalog,
		Images:        imagesCatalog,
	}
	newCatalog, err := uc.dataStore.Create(ctx, catalogRequest)
	if err != nil {
		logger.Log.Debug("error while CreateCatalog. error in method Create", zap.Error(err))
		return nil, err
	}
	for _, i := range catalogRequest.DefaultImages {
		image := &catalog.DefaultImageCatalog{
			CatalogId: catalogRequest.Id,
			Url:       i.Url,
		}
		_, err := uc.dataStore.AddDefaultImage(ctx, image)
		if err != nil {
			logger.Log.Debug("error while CreateCatalog. error in method AddDefaultImage", zap.Error(err))
			return nil, err
		}
	}
	for _, i := range catalogRequest.Images {
		image := &catalog.ImageCatalog{
			CatalogId: catalogRequest.Id,
			Url:       i.Url,
		}
		_, err := uc.dataStore.AddImage(ctx, image)
		if err != nil {
			logger.Log.Debug("error while CreateCatalog. error in method AddImage", zap.Error(err))
			return nil, err
		}
	}
	response, err := uc.dataStore.FindByUuid(ctx, newCatalog.Uuid)
	if err != nil {
		logger.Log.Debug("error while GetCatalogByUuid. error in method FindByUuid", zap.Error(err))
		return nil, err
	}
	return response, nil
}
