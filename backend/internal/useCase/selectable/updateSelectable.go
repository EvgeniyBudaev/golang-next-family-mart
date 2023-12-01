package selectable

import (
	errorDomain "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/error"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/selectable"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"net/http"
	"time"
)

type UpdateSelectableRequest struct {
	Uuid  uuid.UUID `json:"uuid"`
	Value string    `json:"value"`
}

type UpdateSelectableUseCase struct {
	dataStore ISelectableStore
}

func NewUpdateSelectableUseCase(ds ISelectableStore) *UpdateSelectableUseCase {
	return &UpdateSelectableUseCase{
		dataStore: ds,
	}
}

func (uc *UpdateSelectableUseCase) UpdateSelectable(ctx *fiber.Ctx, r UpdateSelectableRequest) (*selectable.Selectable, error) {
	selectableInDB, err := uc.dataStore.FindByUuid(ctx, r.Uuid)
	if err != nil {
		logger.Log.Debug("error while UpdateSelectable. error in method FindByUuid", zap.Error(err))
		return nil, err
	}
	if selectableInDB.Deleted == true {
		msg := errors.Wrap(err, "selectable has already been deleted")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	var request = &selectable.Selectable{
		Id:        selectableInDB.Id,
		CreatedAt: selectableInDB.CreatedAt,
		Deleted:   selectableInDB.Deleted,
		Enabled:   selectableInDB.Enabled,
		UpdatedAt: time.Now(),
		Uuid:      r.Uuid,
		Value:     r.Value,
	}
	response, err := uc.dataStore.Update(ctx, request)
	if err != nil {
		logger.Log.Debug("error while UpdateSelectableInDB. error in method Update", zap.Error(err))
		return nil, err
	}
	return response, nil
}
