package attribute

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/attribute"
	"github.com/gofiber/fiber/v2"
)

type IAttributeStore interface {
	Create(cf *fiber.Ctx, a *attribute.Attribute) (*attribute.Attribute, error)
}
