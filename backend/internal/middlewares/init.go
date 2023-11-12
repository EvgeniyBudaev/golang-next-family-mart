package middlewares

import (
	"context"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/config"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/identity"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/shared/enums"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/requestid"
)

func InitFiberMiddlewares(app *fiber.App,
	config *config.Config,
	store *postgres.Store,
	initPublicRoutes func(app *fiber.App, config *config.Config, store *postgres.Store),
	initProtectedRoutes func(app *fiber.App, config *config.Config, store *postgres.Store)) {
	app.Use(requestid.New())
	app.Use(func(c *fiber.Ctx) error {
		// get the request id that was added by requestid middleware
		var requestId = c.Locals("requestid")
		// create a new context and add the requestid to it
		var ctx = context.WithValue(context.Background(), enums.ContextKeyRequestId, requestId)
		c.SetUserContext(ctx)
		return c.Next()
	})
	// routes that don't require a JWT token
	initPublicRoutes(app, config, store)
	tokenRetrospector := identity.NewIdentity(config)
	app.Use(NewJwtMiddleware(config, tokenRetrospector))
	// routes that require authentication/authorization
	initProtectedRoutes(app, config, store)
}
