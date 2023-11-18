package routes

import (
	catalogHandler "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/api/handlers/catalog"
	productHandler "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/api/handlers/product"
	registerHandler "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/api/handlers/register"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/config"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/identity"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/middlewares"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres"
	catalogStore "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres/catalog"
	productStore "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres/product"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/useCase/catalog"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/useCase/product"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/useCase/user"
	"github.com/gofiber/fiber/v2"
)

var (
	prefix string = "/api/v1"
)

func InitPublicRoutes(app *fiber.App, config *config.Config, store *postgres.Store) {
	grp := app.Group(prefix)

	// store
	catalogDataStore := catalogStore.NewDBCatalogStore(store)
	productDataStore := productStore.NewDBProductStore(store)
	identityManager := identity.NewIdentity(config)

	// useCase
	useCaseRegister := user.NewRegisterUseCase(identityManager)
	useCaseGetCatalogList := catalog.NewGetCatalogListUseCase(catalogDataStore)
	useCaseGetCatalogByAlias := catalog.NewGetCatalogByAliasUseCase(catalogDataStore)
	useCaseGetCatalogByUuid := catalog.NewGetCatalogByUuidUseCase(catalogDataStore)
	useCaseGetProductList := product.NewGetProductListUseCase(productDataStore)

	// handlers
	grp.Post("/user/register", registerHandler.PostRegisterHandler(useCaseRegister))
	grp.Get("/catalog/list", catalogHandler.GetCatalogListHandler(useCaseGetCatalogList))
	grp.Get("/catalog/alias/:alias", catalogHandler.GetCatalogByAliasHandler(useCaseGetCatalogByAlias))
	grp.Get("/catalog/uuid/:uuid", catalogHandler.GetCatalogByUuidHandler(useCaseGetCatalogByUuid))
	grp.Get("/product/list", productHandler.GetProductListHandler(useCaseGetProductList))
}

func InitProtectedRoutes(app *fiber.App, config *config.Config, store *postgres.Store) {
	grp := app.Group(prefix)

	// store
	catalogDataStore := catalogStore.NewDBCatalogStore(store)
	productDataStore := productStore.NewDBProductStore(store)

	// useCase
	useCaseCreateCatalog := catalog.NewCreateCatalogUseCase(catalogDataStore)
	useCaseDeleteCatalog := catalog.NewDeleteCatalogUseCase(catalogDataStore)
	useCaseUpdateCatalog := catalog.NewUpdateCatalogUseCase(catalogDataStore)
	useCaseCreateProduct := product.NewCreateProductUseCase(productDataStore)

	// handlers
	grp.Post("/catalog/create", middlewares.NewRequiresRealmRole("admin"),
		catalogHandler.CreateCatalogHandler(useCaseCreateCatalog))
	grp.Delete("/catalog/delete/:uuid", middlewares.NewRequiresRealmRole("admin"),
		catalogHandler.DeleteCatalogHandler(useCaseDeleteCatalog))
	grp.Put("/catalog/update", middlewares.NewRequiresRealmRole("admin"),
		catalogHandler.UpdateCatalogHandler(useCaseUpdateCatalog))
	grp.Post("/product/create", middlewares.NewRequiresRealmRole("admin"),
		productHandler.PostProductCreateHandler(useCaseCreateProduct))
}
