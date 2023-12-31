package attribute

import (
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/attribute"
	errorDomain "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/error"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"go.uber.org/zap"
	"net/http"
)

type GetAttributeByUuidUseCase struct {
	dataStore IAttributeStore
}

func NewGetAttributeByUuidUseCase(ds IAttributeStore) *GetAttributeByUuidUseCase {
	return &GetAttributeByUuidUseCase{
		dataStore: ds,
	}
}

func (uc *GetAttributeByUuidUseCase) GetAttributeByUuid(ctx *fiber.Ctx) (*attribute.Attribute, error) {
	params := ctx.Params("uuid")
	paramsStr, err := uuid.Parse(params)
	if err != nil {
		logger.Log.Debug("error while parsing UUID", zap.Error(err))
		return nil, err
	}
	response, err := uc.dataStore.FindByUuid(ctx, paramsStr)
	if err != nil {
		logger.Log.Debug("error while GetAttributeByUuid. error in method FindByUuid", zap.Error(err))
		return nil, err
	}
	if response.IsDeleted == true {
		msg := fmt.Errorf("attribute has already been deleted")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	return response, nil
}
