package product

import (
	"fmt"
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

type UpdateProductRequest struct {
	Uuid      uuid.UUID `json:"uuid"`
	Alias     string    `json:"alias"`
	Name      string    `json:"name"`
	IsEnabled bool      `json:"isEnabled"`
	Image     []byte    `json:"image"`
}

type UpdateProductUseCase struct {
	dataStore IProductStore
}

func NewUpdateProductUseCase(ds IProductStore) *UpdateProductUseCase {
	return &UpdateProductUseCase{
		dataStore: ds,
	}
}

func (uc *UpdateProductUseCase) UpdateProduct(ctx *fiber.Ctx, r UpdateProductRequest) (*product.Product, error) {
	productInDB, err := uc.dataStore.FindByUuid(ctx, r.Uuid)
	if err != nil {
		logger.Log.Debug("error while UpdateProduct. error in method FindByUuid", zap.Error(err))
		return nil, err
	}
	if productInDB.IsDeleted == true {
		msg := errors.Wrap(err, "product has already been deleted")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	directoryPath := "static/uploads/product/image"
	filePath := fmt.Sprintf("%s/defaultImage.jpg", directoryPath)
	form, err := ctx.MultipartForm()
	if err != nil {
		logger.Log.Debug("error while UpdateProduct. error FormFile", zap.Error(err))
		return nil, err
	}
	var productRequest *product.Product
	imageFiles := form.File["image"]
	if len(imageFiles) > 0 {
		imagesFilePath := make([]string, 0, len(imageFiles))
		images := make([]*product.ImageProduct, 0, len(imagesFilePath))
		for _, file := range imageFiles {
			filePath = fmt.Sprintf("%s/%s", directoryPath, file.Filename)
			if err := ctx.SaveFile(file, filePath); err != nil {
				logger.Log.Debug("error while UpdateProduct. error SaveFile", zap.Error(err))
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
		productRequest = &product.Product{
			Uuid:      r.Uuid,
			Alias:     strings.ToLower(r.Alias),
			Name:      r.Name,
			CreatedAt: productInDB.CreatedAt,
			UpdatedAt: time.Now(),
			IsDeleted: false,
			IsEnabled: r.IsEnabled,
			Images:    images,
		}
	} else {
		productRequest = &product.Product{
			Id:           productInDB.Id,
			CatalogId:    productInDB.CatalogId,
			Uuid:         r.Uuid,
			Alias:        strings.ToLower(r.Alias),
			Name:         r.Name,
			CreatedAt:    productInDB.CreatedAt,
			UpdatedAt:    time.Now(),
			IsDeleted:    false,
			IsEnabled:    r.IsEnabled,
			CatalogAlias: productInDB.CatalogAlias,
		}
	}
	updatedProduct, err := uc.dataStore.Update(ctx, productRequest)
	if err != nil {
		logger.Log.Debug("error while UpdateProduct. error in method Update", zap.Error(err))
		return nil, err
	}
	if len(imageFiles) > 0 {
		for _, i := range productRequest.Images {
			image := &product.ImageProduct{
				ProductId: productInDB.Id,
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
				logger.Log.Debug("error while UpdateProduct. error in method AddImage", zap.Error(err))
				return nil, err
			}
		}
	}
	response, err := uc.dataStore.FindByUuid(ctx, updatedProduct.Uuid)
	if err != nil {
		logger.Log.Debug("error while UpdateProduct. error in method FindByUuid", zap.Error(err))
		return nil, err
	}
	return response, nil
}
