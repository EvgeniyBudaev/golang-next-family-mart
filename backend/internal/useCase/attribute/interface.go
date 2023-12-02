package attribute

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/attribute"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type IAttributeStore interface {
	Create(ctx *fiber.Ctx, a *attribute.Attribute) (*attribute.Attribute, error)
	Delete(ctx *fiber.Ctx, a *attribute.Attribute) (*attribute.Attribute, error)
	FindByAlias(ctx *fiber.Ctx, a string) (*attribute.Attribute, error)
	FindByUuid(ctx *fiber.Ctx, u uuid.UUID) (*attribute.Attribute, error)
	SelectList(ctx *fiber.Ctx, qp *attribute.QueryParamsAttributeList) (*attribute.ListAttributeResponse, error)
	Update(ctx *fiber.Ctx, a *attribute.Attribute) (*attribute.Attribute, error)
}
