package attribute

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/attribute"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"strings"
	"time"
)

type CreateAttributeRequest struct {
	CatalogId int    `json:"catalogId"`
	Alias     string `json:"alias"`
	Name      string `json:"name"`
	Type      string `json:"type"`
}

type CreateAttributeUseCase struct {
	dataStore IAttributeStore
}

func NewCreateAttributeUseCase(ds IAttributeStore) *CreateAttributeUseCase {
	return &CreateAttributeUseCase{
		dataStore: ds,
	}
}

func (uc *CreateAttributeUseCase) CreateAttribute(ctx *fiber.Ctx, r CreateAttributeRequest) (*attribute.Attribute, error) {
	var request = &attribute.Attribute{
		CatalogId:  r.CatalogId,
		Uuid:       uuid.New(),
		Alias:      strings.ToLower(r.Alias),
		Name:       r.Name,
		Type:       strings.ToLower(r.Type),
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
		IsDeleted:  false,
		IsEnabled:  true,
		IsFiltered: true,
	}
	response, err := uc.dataStore.Create(ctx, request)
	if err != nil {
		logger.Log.Debug("error while CreateAttribute. error in method Create", zap.Error(err))
		return nil, err
	}
	return response, nil
}
