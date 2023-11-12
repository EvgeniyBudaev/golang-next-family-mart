package middlewares

import (
	"fmt"
	r "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/response"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/shared/enums"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/shared/jwt"
	"github.com/gofiber/fiber/v2"
	golangJwt "github.com/golang-jwt/jwt/v5"
	"go.uber.org/zap"
	"net/http"
)

func NewRequiresRealmRole(role string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var ctx = c.UserContext()
		claims := ctx.Value(enums.ContextKeyClaims).(golangJwt.MapClaims)
		jwtHelper := jwt.NewJwtHelper(claims)
		if !jwtHelper.IsUserInRealmRole(role) {
			err := fmt.Errorf("role authorization failed")
			logger.Log.Debug("error while NewRequiresRealmRole. Error in IsUserInRealmRole", zap.Error(err))
			return r.WrapError(c, err, http.StatusUnauthorized)
		}
		return c.Next()
	}
}
