package selectable

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/selectable"
	"github.com/gofiber/fiber/v2"
)

type ISelectableStore interface {
	Create(ctx *fiber.Ctx, s *selectable.Selectable) (*selectable.Selectable, error)
}
