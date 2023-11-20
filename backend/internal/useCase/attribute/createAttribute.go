package attribute

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/attribute"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/attribute/selectable"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"strings"
	"time"
)

type SelectableRequest struct {
	Value string `json:"value"`
}

type CreateAttributeRequest struct {
	Alias      string               `json:"alias"`
	Filtered   bool                 `json:"filtered"`
	Name       string               `json:"name"`
	Selectable *[]SelectableRequest `json:"selectable"`
	Type       string               `json:"type"`
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
	selectableRequest := make([]*selectable.Selectable, 0)
	for _, selReq := range selectableRequest {
		newSelectable := selectable.NewSelectable(&selectable.Selectable{
			AliasAttribute: r.Alias,
			Uuid:           uuid.New(),
			Value:          selReq.Value,
		})
		selectableRequest = append(selectableRequest, newSelectable)
	}
	var request = &attribute.Attribute{
		Alias:      strings.ToLower(r.Alias),
		CreatedAt:  time.Now(),
		Deleted:    false,
		Enabled:    true,
		Filtered:   r.Filtered,
		Name:       strings.ToLower(r.Name),
		Type:       strings.ToLower(r.Type),
		UpdatedAt:  time.Now(),
		Uuid:       uuid.New(),
		Selectable: selectableRequest,
	}
	response, err := uc.dataStore.Create(ctx, request)
	if err != nil {
		logger.Log.Debug("error while CreateAttribute. error in method Create", zap.Error(err))
		return nil, err
	}
	return response, nil
}
