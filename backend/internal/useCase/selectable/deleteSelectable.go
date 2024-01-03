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

type DeleteSelectableRequest struct {
	Uuid uuid.UUID `json:"uuid"`
}

type DeleteSelectableUseCase struct {
	dataStore ISelectableStore
}

func NewDeleteSelectableUseCase(ds ISelectableStore) *DeleteSelectableUseCase {
	return &DeleteSelectableUseCase{
		dataStore: ds,
	}
}

func (uc *DeleteSelectableUseCase) DeleteSelectable(ctx *fiber.Ctx, r DeleteSelectableRequest) (*selectable.Selectable, error) {
	selectableInDB, err := uc.dataStore.FindByUuid(ctx, r.Uuid)
	if err != nil {
		logger.Log.Debug("error while DeleteSelectable. error in method FindByUuid", zap.Error(err))
		return nil, err
	}
	if selectableInDB.IsDeleted == true {
		msg := errors.Wrap(err, "selectable has already been deleted")
		err = errorDomain.NewCustomError(msg, http.StatusNotFound)
		return nil, err
	}
	var request = &selectable.Selectable{
		Id:          selectableInDB.Id,
		AttributeId: selectableInDB.AttributeId,
		Uuid:        r.Uuid,
		Value:       selectableInDB.Value,
		CreatedAt:   selectableInDB.CreatedAt,
		UpdatedAt:   time.Now(),
		IsDeleted:   true,
		IsEnabled:   selectableInDB.IsEnabled,
	}
	response, err := uc.dataStore.Delete(ctx, request)
	if err != nil {
		logger.Log.Debug("error while DeleteSelectableInDB. error in method Update", zap.Error(err))
		return nil, err
	}
	return response, nil
}
