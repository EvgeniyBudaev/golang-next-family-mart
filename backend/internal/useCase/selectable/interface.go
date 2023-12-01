package selectable

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/selectable"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type ISelectableStore interface {
	Create(ctx *fiber.Ctx, s *selectable.Selectable) (*selectable.Selectable, error)
	Delete(cf *fiber.Ctx, s *selectable.Selectable) (*selectable.Selectable, error)
	FindByUuid(ctx *fiber.Ctx, u uuid.UUID) (*selectable.Selectable, error)
	SelectList(ctx *fiber.Ctx, qp *selectable.QueryParamsSelectableList,
		attributeId int) (*selectable.ListSelectableResponse, error)
	Update(cf *fiber.Ctx, s *selectable.Selectable) (*selectable.Selectable, error)
}
