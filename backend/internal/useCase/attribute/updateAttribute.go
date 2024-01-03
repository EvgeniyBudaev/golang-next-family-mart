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
	Uuid  uuid.UUID `json:"uuid"`
	Alias string    `json:"alias"`
	Name  string    `json:"name"`
	Type  string    `json:"type"`
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
		logger.Log.Debug("error while UpdateAttribute. error in method FindByUuid", zap.Error(err))
		return nil, err
	}
	if attributeInDB.IsDeleted == true {
		msg := errors.Wrap(err, "attribute has already been deleted")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	var request = &attribute.Attribute{
		Id:         attributeInDB.Id,
		CatalogId:  attributeInDB.CatalogId,
		Uuid:       r.Uuid,
		Alias:      strings.ToLower(r.Alias),
		Name:       r.Name,
		Type:       strings.ToLower(r.Type),
		CreatedAt:  attributeInDB.CreatedAt,
		UpdatedAt:  time.Now(),
		IsDeleted:  attributeInDB.IsDeleted,
		IsEnabled:  attributeInDB.IsEnabled,
		IsFiltered: attributeInDB.IsFiltered,
	}
	response, err := uc.dataStore.Update(ctx, request)
	if err != nil {
		logger.Log.Debug("error while UpdateAttribute. error in method Update", zap.Error(err))
		return nil, err
	}
	return response, nil
}
