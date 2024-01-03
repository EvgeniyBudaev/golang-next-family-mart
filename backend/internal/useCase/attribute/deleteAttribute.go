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
	"time"
)

type DeleteAttributeRequest struct {
	Uuid uuid.UUID `json:"uuid"`
}

type DeleteAttributeUseCase struct {
	dataStore IAttributeStore
}

func NewDeleteAttributeUseCase(ds IAttributeStore) *DeleteAttributeUseCase {
	return &DeleteAttributeUseCase{
		dataStore: ds,
	}
}

func (uc *DeleteAttributeUseCase) DeleteAttribute(ctx *fiber.Ctx, r DeleteAttributeRequest) (*attribute.Attribute, error) {
	attributeInDB, err := uc.dataStore.FindByUuid(ctx, r.Uuid)
	if err != nil {
		logger.Log.Debug("error while DeleteCatalog. error in method FindByUuid", zap.Error(err))
		return nil, err
	}
	if attributeInDB.IsDeleted == true {
		msg := errors.Wrap(err, "attribute has already been deleted")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	var request = &attribute.Attribute{
		Id:         attributeInDB.Id,
		Uuid:       r.Uuid,
		Alias:      attributeInDB.Alias,
		Name:       attributeInDB.Name,
		Type:       attributeInDB.Type,
		CreatedAt:  attributeInDB.CreatedAt,
		UpdatedAt:  time.Now(),
		IsDeleted:  true,
		IsEnabled:  attributeInDB.IsEnabled,
		IsFiltered: attributeInDB.IsFiltered,
	}
	deletedAttribute, err := uc.dataStore.Delete(ctx, request)
	if err != nil {
		logger.Log.Debug("error while DeleteAttribute. error in method Delete", zap.Error(err))
		return nil, err
	}
	response, err := uc.dataStore.FindByUuid(ctx, deletedAttribute.Uuid)
	if err != nil {
		logger.Log.Debug("error while DeleteAttribute. error in method FindByUuid", zap.Error(err))
		return nil, err
	}
	return response, nil
}
