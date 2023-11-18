package response

import (
	"errors"
	errorDomain "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/error"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/success"
	"github.com/gofiber/fiber/v2"
	"net/http"
)

func WrapError(ctx *fiber.Ctx, err error, httpStatusCode int) error {
	var customError *errorDomain.CustomError
	if errors.As(err, &customError) {
		msg := errorDomain.ResponseError{
			StatusCode: customError.StatusCode,
			Success:    false,
			Message:    customError.Err.Error(),
		}
		return ctx.Status(customError.StatusCode).JSON(msg)
	}
	msg := errorDomain.ResponseError{
		StatusCode: httpStatusCode,
		Success:    false,
		Message:    err.Error(),
	}
	return ctx.Status(httpStatusCode).JSON(msg)
}

func WrapOk(ctx *fiber.Ctx, data interface{}) error {
	msg := success.Success{
		Data:       data,
		StatusCode: http.StatusOK,
		Success:    true,
	}
	return ctx.Status(fiber.StatusOK).JSON(msg)
}

func WrapCreated(ctx *fiber.Ctx, data interface{}) error {
	msg := success.Success{
		Data:       data,
		StatusCode: http.StatusCreated,
		Success:    true,
	}
	return ctx.Status(fiber.StatusCreated).JSON(msg)
}
