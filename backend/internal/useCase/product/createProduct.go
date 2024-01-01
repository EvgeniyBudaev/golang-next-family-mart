package product

import (
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/product"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"strings"
	"time"
)

type CreateProductRequest struct {
	CatalogId int    `json:"catalogId"`
	Alias     string `json:"alias"`
	Name      string `json:"name"`
	Image     []byte `json:"image"`
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
	directoryPath := "static/uploads/product/image"
	filePath := fmt.Sprintf("%s/defaultImage.jpg", directoryPath)
	form, err := ctx.MultipartForm()
	if err != nil {
		logger.Log.Debug("error while CreateProduct. error FormFile", zap.Error(err))
		return nil, err
	}
	imageFiles := form.File["image"]
	imagesFilePath := make([]string, 0, len(imageFiles))
	images := make([]*product.ImageProduct, 0, len(imagesFilePath))
	for _, file := range imageFiles {
		filePath = fmt.Sprintf("%s/%s", directoryPath, file.Filename)
		if err := ctx.SaveFile(file, filePath); err != nil {
			logger.Log.Debug("error while CreateProduct. error SaveFile", zap.Error(err))
			return nil, err
		}
		image := product.ImageProduct{
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
		images = append(images, &image)
	}
	var request = &product.Product{
		CatalogId: r.CatalogId,
		Uuid:      uuid.New(),
		Alias:     strings.ToLower(r.Alias),
		Name:      r.Name,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
		IsDeleted: false,
		IsEnabled: true,
		Images:    images,
	}
	newProduct, err := uc.dataStore.Create(ctx, request)
	if err != nil {
		logger.Log.Debug("error while CreateProduct. error in method Create", zap.Error(err))
		return nil, err
	}
	for _, i := range request.Images {
		image := &product.ImageProduct{
			ProductId: newProduct.Id,
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
			logger.Log.Debug("error while CreateProduct. error in method AddImage", zap.Error(err))
			return nil, err
		}
	}
	response, err := uc.dataStore.FindByUuid(ctx, newProduct.Uuid)
	if err != nil {
		logger.Log.Debug("error while CreateProduct. error in method FindByUuid", zap.Error(err))
		return nil, err
	}
	return response, nil
}
