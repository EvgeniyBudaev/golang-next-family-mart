package register

import (
	"context"
	r "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/response"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/useCase/user"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type IRegisterUseCase interface {
	Register(ctx context.Context, request user.RegisterRequest) (*user.RegisterResponse, error)
}

func PostRegisterHandler(uc IRegisterUseCase) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var ctx = c.UserContext()
		logger.Log.Info("post to auth POST /api/v1/user/register")
		var request = user.RegisterRequest{}
		err := c.BodyParser(&request)
		if err != nil {
			logger.Log.Debug("error while PostRegisterHandler. Error in BodyParser", zap.Error(err))
			return r.WrapError(c, err, http.StatusBadRequest)
		}
		response, err := uc.Register(ctx, request)
		if err != nil {
			logger.Log.Debug("error while PostRegisterHandler. Error in Register", zap.Error(err))
			return r.WrapError(c, err, http.StatusBadRequest)
		}
		return r.WrapCreated(c, response)
	}
}
