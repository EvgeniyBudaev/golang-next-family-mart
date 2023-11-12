package routes

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/api/handlers"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/config"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/identity"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/middlewares"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres"
	cs "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres/catalog"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/useCase/catalog"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/useCase/user"
	"github.com/gofiber/fiber/v2"
)

var (
	prefix string = "/api/v1"
)

func InitPublicRoutes(app *fiber.App, config *config.Config, store *postgres.Store) {
	grp := app.Group(prefix)
	catalogDataStore := cs.NewDBCatalogStore(store)
	identityManager := identity.NewIdentity(config)
	useCaseRegister := user.NewRegisterUseCase(identityManager)
	useCaseCreateCatalog := catalog.NewCreateCatalogUseCase(catalogDataStore)
	useCaseGetCatalogList := catalog.NewGetCatalogListUseCase(catalogDataStore)
	registerHandler := handlers.NewRegisterHandler(useCaseRegister)
	catalogHandler := handlers.NewCatalogHandler(useCaseCreateCatalog, useCaseGetCatalogList)

	// handlers
	grp.Post("/user/register", registerHandler.PostRegisterHandler(useCaseRegister))
	//grp.Post("/catalog/create", catalogHandler.PostCatalogCreateHandler(useCaseCreateCatalog))
	grp.Get("/catalog/list", catalogHandler.GetCatalogListHandler(useCaseGetCatalogList))
}

func InitProtectedRoutes(app *fiber.App, config *config.Config, store *postgres.Store) {
	grp := app.Group(prefix)
	catalogDataStore := cs.NewDBCatalogStore(store)
	useCaseCreateCatalog := catalog.NewCreateCatalogUseCase(catalogDataStore)
	useCaseGetCatalogList := catalog.NewGetCatalogListUseCase(catalogDataStore)
	catalogHandler := handlers.NewCatalogHandler(useCaseCreateCatalog, useCaseGetCatalogList)
	grp.Post("/catalog/create", middlewares.NewRequiresRealmRole("admin"),
		catalogHandler.PostCatalogCreateHandler(useCaseCreateCatalog))
}
