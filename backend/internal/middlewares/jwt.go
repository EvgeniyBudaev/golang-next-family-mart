package middlewares

import (
	"context"
	"crypto/rsa"
	"crypto/x509"
	"encoding/base64"
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/config"
	r "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/response"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/shared/enums"
	"github.com/Nerzal/gocloak/v13"
	contribJwt "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"
	golangJwt "github.com/golang-jwt/jwt/v5"
	"go.uber.org/zap"
	"net/http"
)

type TokenRetrospector interface {
	RetrospectToken(ctx context.Context, accessToken string) (*gocloak.IntroSpectTokenResult, error)
}

func NewJwtMiddleware(config *config.Config, tokenRetrospector TokenRetrospector) fiber.Handler {
	base64Str := config.RealmRS256PublicKey
	publicKey, err := parseKeycloakRSAPublicKey(base64Str)
	if err != nil {
		logger.Log.Debug("error while NewJwtMiddleware. Error in parseKeycloakRSAPublicKey", zap.Error(err))
		panic(err)
	}
	return contribJwt.New(contribJwt.Config{
		SigningKey: contribJwt.SigningKey{
			JWTAlg: contribJwt.RS256,
			Key:    publicKey,
		},
		SuccessHandler: func(c *fiber.Ctx) error {
			return successHandler(c, tokenRetrospector)
		},
	})
}

func successHandler(c *fiber.Ctx, tokenRetrospector TokenRetrospector) error {
	jwtToken := c.Locals("user").(*golangJwt.Token)
	claims := jwtToken.Claims.(golangJwt.MapClaims)
	var ctx = c.UserContext()
	var contextWithClaims = context.WithValue(ctx, enums.ContextKeyClaims, claims)
	c.SetUserContext(contextWithClaims)
	rptResult, err := tokenRetrospector.RetrospectToken(ctx, jwtToken.Raw)
	if err != nil {
		logger.Log.Debug("error while successHandler. Error in RetrospectToken", zap.Error(err))
		return err
	}
	if !*rptResult.Active {
		err := fmt.Errorf("token is not active")
		logger.Log.Debug("error while successHandler. Error in parseKeycloakRSAPublicKey", zap.Error(err))
		return r.WrapError(c, err, http.StatusUnauthorized)
	}
	return c.Next()
}

func parseKeycloakRSAPublicKey(base64Str string) (*rsa.PublicKey, error) {
	buf, err := base64.StdEncoding.DecodeString(base64Str)
	if err != nil {
		logger.Log.Debug("error while parseKeycloakRSAPublicKey. Error in DecodeString", zap.Error(err))
		return nil, err
	}
	parsedKey, err := x509.ParsePKIXPublicKey(buf)
	if err != nil {
		logger.Log.Debug("error while parseKeycloakRSAPublicKey. Error in ParsePKIXPublicKey", zap.Error(err))
		return nil, err
	}
	publicKey, ok := parsedKey.(*rsa.PublicKey)
	if ok {
		return publicKey, nil
	}
	err = fmt.Errorf("unexpected key type %T", publicKey)
	logger.Log.Debug("error while parseKeycloakRSAPublicKey", zap.Error(err))
	return nil, err
}
