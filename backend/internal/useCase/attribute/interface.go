package attribute

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/attribute"
	"github.com/gofiber/fiber/v2"
)

type IAttributeStore interface {
	Create(ctx *fiber.Ctx, a *attribute.RequestAttribute) (*attribute.Attribute, error)
}
