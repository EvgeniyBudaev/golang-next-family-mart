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
	Alias        string   `json:"alias"`
	DefaultImage []byte   `json:"defaultImage"`
	Image        []string `json:"image"`
	Name         string   `json:"name"`
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
	form, err := ctx.MultipartForm()
	if err != nil {
		logger.Log.Debug("error while CreateCatalog. error FormFile", zap.Error(err))
		return nil, err
	}
	defaultImageFiles := form.File["defaultImage"]
	imageFiles := form.File["image"]
	directoryPath := fmt.Sprintf("./static/uploads/catalog/image")

	defaultImagePath := "./static/uploads/catalog/image/defaultImage.jpg"

	for _, file := range defaultImageFiles {
		filePath = fmt.Sprintf("%s/%s", directoryPath, file.Filename)
		defaultImagePath = filePath
		if err := ctx.SaveFile(file, filePath); err != nil {
			logger.Log.Debug("error while CreateCatalog. error SaveFile", zap.Error(err))
			return nil, err
		}
	}

	imagesFilePath := make([]string, 0, len(imageFiles))

	for _, file := range imageFiles {
		filePath = fmt.Sprintf("%s/%s", directoryPath, file.Filename)
		if err := ctx.SaveFile(file, filePath); err != nil {
			logger.Log.Debug("error while CreateCatalog. error SaveFile", zap.Error(err))
			return nil, err
		}
		imagesFilePath = append(imagesFilePath, filePath)
	}

	var request = &catalog.Catalog{
		Alias:        strings.ToLower(r.Alias),
		CreatedAt:    time.Now(),
		DefaultImage: defaultImagePath,
		Deleted:      false,
		Enabled:      true,
		Image:        imagesFilePath,
		Name:         strings.ToLower(r.Name),
		UpdatedAt:    time.Now(),
		Uuid:         uuid.New(),
	}
	fmt.Println(request)
	response, err := uc.dataStore.Create(ctx, request)
	if err != nil {
		logger.Log.Debug("error while CreateCatalog. error in method Create", zap.Error(err))
		return nil, err
	}
	return response, nil
}
