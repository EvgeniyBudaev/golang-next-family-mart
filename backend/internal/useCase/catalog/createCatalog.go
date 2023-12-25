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
	DefaultImage []byte `json:"default_image"`
	Name         string `json:"name"`
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
	filename := "./static/uploads/catalog/image/defaultImage.jpg"
	form, err := ctx.MultipartForm()
	if err != nil {
		logger.Log.Debug("error while CreateCatalog. error FormFile", zap.Error(err))
		return nil, err
	}
	files := form.File["default_image"]
	directoryPath := fmt.Sprintf("./static/uploads/catalog/image")

	for _, file := range files {
		filename = fmt.Sprintf("%s/%s", directoryPath, file.Filename)
		fmt.Println(file.Size, file.Header["Content-Type"][0])
		fmt.Println("filename: ", filename)
		if err := ctx.SaveFile(file, filename); err != nil {
			logger.Log.Debug("error while CreateCatalog. error SaveFile", zap.Error(err))
			return nil, err
		}
	}

	var request = &catalog.Catalog{
		Alias:        strings.ToLower(r.Alias),
		CreatedAt:    time.Now(),
		DefaultImage: filename,
		Deleted:      false,
		Enabled:      true,
		Image:        "",
		Name:         strings.ToLower(r.Name),
		UpdatedAt:    time.Now(),
		Uuid:         uuid.New(),
	}
	response, err := uc.dataStore.Create(ctx, request)
	if err != nil {
		logger.Log.Debug("error while CreateCatalog. error in method Create", zap.Error(err))
		return nil, err
	}
	return response, nil
}
