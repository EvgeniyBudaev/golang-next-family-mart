package selectable

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/selectable"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"time"
)

type CreateSelectableRequest struct {
	AttributeId int    `json:"attributeId"`
	Value       string `json:"value"`
}

type CreateSelectableUseCase struct {
	dataStore ISelectableStore
}

func NewCreateSelectableUseCase(ds ISelectableStore) *CreateSelectableUseCase {
	return &CreateSelectableUseCase{
		dataStore: ds,
	}
}

func (uc *CreateSelectableUseCase) CreateSelectable(ctx *fiber.Ctx, r CreateSelectableRequest) (*selectable.Selectable, error) {
	var request = &selectable.Selectable{
		AttributeId: r.AttributeId,
		Uuid:        uuid.New(),
		Value:       r.Value,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
		IsDeleted:   false,
		IsEnabled:   true,
	}
	response, err := uc.dataStore.Create(ctx, request)
	if err != nil {
		logger.Log.Debug("error while CreateSelectable. error in method Create", zap.Error(err))
		return nil, err
	}
	return response, nil
}
