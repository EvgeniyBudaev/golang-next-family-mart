package attribute

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/attribute"
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

type UpdateAttributeRequest struct {
	Alias string    `json:"alias"`
	Name  string    `json:"name"`
	Type  string    `json:"type"`
	Uuid  uuid.UUID `json:"uuid"`
}

type UpdateAttributeUseCase struct {
	dataStore IAttributeStore
}

func NewUpdateAttributeUseCase(ds IAttributeStore) *UpdateAttributeUseCase {
	return &UpdateAttributeUseCase{
		dataStore: ds,
	}
}

func (uc *UpdateAttributeUseCase) UpdateAttribute(ctx *fiber.Ctx, r UpdateAttributeRequest) (*attribute.Attribute, error) {
	attributeInDB, err := uc.dataStore.FindByUuid(ctx, r.Uuid)
	if err != nil {
		logger.Log.Debug("error while UpdateCatalog. error in method FindByUuid", zap.Error(err))
		return nil, err
	}
	if attributeInDB.Deleted == true {
		msg := errors.Wrap(err, "attribute has already been deleted")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	var request = &attribute.Attribute{
		Id:        attributeInDB.Id,
		Alias:     strings.ToLower(r.Alias),
		CreatedAt: attributeInDB.CreatedAt,
		Deleted:   attributeInDB.Deleted,
		Enabled:   attributeInDB.Enabled,
		Filtered:  attributeInDB.Filtered,
		Name:      r.Name,
		Type:      strings.ToLower(r.Type),
		UpdatedAt: time.Now(),
		Uuid:      r.Uuid,
	}
	response, err := uc.dataStore.Update(ctx, request)
	if err != nil {
		logger.Log.Debug("error while UpdateAttribute. error in method Update", zap.Error(err))
		return nil, err
	}
	return response, nil
}
