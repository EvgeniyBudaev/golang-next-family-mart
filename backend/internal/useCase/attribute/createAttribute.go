package attribute

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/attribute"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/selectable"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"strings"
	"time"
)

type CreateAttributeRequest struct {
	Alias      string                                   `json:"alias"`
	Name       string                                   `json:"name"`
	Selectable []*selectable.RequestAttributeSelectable `json:"selectable"`
	Type       string                                   `json:"type"`
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
	var request = &attribute.RequestAttribute{
		Alias:      strings.ToLower(r.Alias),
		CreatedAt:  time.Now(),
		Deleted:    false,
		Enabled:    true,
		Filtered:   true,
		Name:       strings.ToLower(r.Name),
		Type:       strings.ToLower(r.Type),
		UpdatedAt:  time.Now(),
		Uuid:       uuid.New(),
		Selectable: r.Selectable,
	}
	response, err := uc.dataStore.Create(ctx, request)
	if err != nil {
		logger.Log.Debug("error while CreateAttribute. error in method Create", zap.Error(err))
		return nil, err
	}
	return response, nil
}
