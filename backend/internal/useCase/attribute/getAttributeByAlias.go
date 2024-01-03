package attribute

import (
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/attribute"
	errorDomain "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/error"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type GetAttributeByAliasUseCase struct {
	dataStore IAttributeStore
}

func NewGetAttributeByAliasUseCase(ds IAttributeStore) *GetAttributeByAliasUseCase {
	return &GetAttributeByAliasUseCase{
		dataStore: ds,
	}
}

func (uc *GetAttributeByAliasUseCase) GetAttributeByAlias(ctx *fiber.Ctx) (*attribute.Attribute, error) {
	params := ctx.Params("alias")
	response, err := uc.dataStore.FindByAlias(ctx, params)
	if err != nil {
		logger.Log.Debug("error while GetAttributeByAlias. error in method FindByUuid", zap.Error(err))
		return nil, err
	}
	if response.IsDeleted == true {
		msg := fmt.Errorf("attribute has already been deleted")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	return response, nil
}
