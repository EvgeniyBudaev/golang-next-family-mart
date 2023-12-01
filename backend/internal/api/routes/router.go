package routes

import (
	attributeHandler "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/api/handlers/attribute"
	catalogHandler "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/api/handlers/catalog"
	productHandler "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/api/handlers/product"
	registerHandler "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/api/handlers/register"
	selectableHandler "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/api/handlers/selectable"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/config"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/identity"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/middlewares"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres"
	attributeStore "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres/attribute"
	catalogStore "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres/catalog"
	productStore "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres/product"
	selectableStore "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres/selectable"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/useCase/attribute"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/useCase/catalog"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/useCase/product"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/useCase/selectable"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/useCase/user"
	"github.com/gofiber/fiber/v2"
)

var (
	prefix string = "/api/v1"
)

func InitPublicRoutes(app *fiber.App, config *config.Config, store *postgres.Store) {
	grp := app.Group(prefix)

	// store
	attributeDataStore := attributeStore.NewDBAttributeStore(store)
	catalogDataStore := catalogStore.NewDBCatalogStore(store)
	productDataStore := productStore.NewDBProductStore(store)
	selectableDataStore := selectableStore.NewDBSelectableStore(store)
	identityManager := identity.NewIdentity(config)

	// useCase
	useCaseRegister := user.NewRegisterUseCase(identityManager)
	useCaseGetAttributeList := attribute.NewGetAttributeListUseCase(attributeDataStore)
	useCaseGetAttributeByAlias := attribute.NewGetAttributeByAliasUseCase(attributeDataStore)
	useCaseGetAttributeByUuid := attribute.NewGetAttributeByUuidUseCase(attributeDataStore)
	useCaseGetCatalogList := catalog.NewGetCatalogListUseCase(catalogDataStore)
	useCaseGetCatalogByAlias := catalog.NewGetCatalogByAliasUseCase(catalogDataStore)
	useCaseGetCatalogByUuid := catalog.NewGetCatalogByUuidUseCase(catalogDataStore)
	useCaseGetProductList := product.NewGetProductListUseCase(productDataStore)
	useCaseGetProductByAlias := product.NewGetProductByAliasUseCase(productDataStore)
	useCaseGetProductByUuid := product.NewGetProductByUuidUseCase(productDataStore)
	useCaseGetSelectableList := selectable.NewGetSelectableListUseCase(selectableDataStore)

	// handlers
	grp.Post("/user/register", registerHandler.PostRegisterHandler(useCaseRegister))
	grp.Get("/attribute/list", attributeHandler.GetAttributeListHandler(useCaseGetAttributeList))
	grp.Get("/attribute/alias/:alias", attributeHandler.GetAttributeByAliasHandler(useCaseGetAttributeByAlias))
	grp.Get("/attribute/uuid/:uuid", attributeHandler.GetAttributeByUuidHandler(useCaseGetAttributeByUuid))
	grp.Get("/catalog/list", catalogHandler.GetCatalogListHandler(useCaseGetCatalogList))
	grp.Get("/catalog/alias/:alias", catalogHandler.GetCatalogByAliasHandler(useCaseGetCatalogByAlias))
	grp.Get("/catalog/uuid/:uuid", catalogHandler.GetCatalogByUuidHandler(useCaseGetCatalogByUuid))
	grp.Get("/product/list", productHandler.GetProductListHandler(useCaseGetProductList))
	grp.Get("/product/alias/:alias", productHandler.GetProductByAliasHandler(useCaseGetProductByAlias))
	grp.Get("/product/uuid/:uuid", productHandler.GetProductByUuidHandler(useCaseGetProductByUuid))
	grp.Get("/selectable/:id/list", selectableHandler.GetSelectableListHandler(useCaseGetSelectableList))
}

func InitProtectedRoutes(app *fiber.App, config *config.Config, store *postgres.Store) {
	grp := app.Group(prefix)

	// store
	attributeDataStore := attributeStore.NewDBAttributeStore(store)
	catalogDataStore := catalogStore.NewDBCatalogStore(store)
	productDataStore := productStore.NewDBProductStore(store)
	selectableDataStore := selectableStore.NewDBSelectableStore(store)

	// useCase
	useCaseCreateAttribute := attribute.NewCreateAttributeUseCase(attributeDataStore)
	useCaseUpdateAttribute := attribute.NewUpdateAttributeUseCase(attributeDataStore)
	useCaseCreateCatalog := catalog.NewCreateCatalogUseCase(catalogDataStore)
	useCaseDeleteCatalog := catalog.NewDeleteCatalogUseCase(catalogDataStore)
	useCaseUpdateCatalog := catalog.NewUpdateCatalogUseCase(catalogDataStore)
	useCaseCreateProduct := product.NewCreateProductUseCase(productDataStore)
	useCaseCreateSelectable := selectable.NewCreateSelectableUseCase(selectableDataStore)

	// handlers
	grp.Post("/attribute/create", middlewares.NewRequiresRealmRole("admin"),
		attributeHandler.CreateAttributeHandler(useCaseCreateAttribute))
	grp.Put("/attribute/update", middlewares.NewRequiresRealmRole("admin"),
		attributeHandler.UpdateAttributeHandler(useCaseUpdateAttribute))
	grp.Post("/catalog/create", middlewares.NewRequiresRealmRole("admin"),
		catalogHandler.CreateCatalogHandler(useCaseCreateCatalog))
	grp.Delete("/catalog/delete/:uuid", middlewares.NewRequiresRealmRole("admin"),
		catalogHandler.DeleteCatalogHandler(useCaseDeleteCatalog))
	grp.Put("/catalog/update", middlewares.NewRequiresRealmRole("admin"),
		catalogHandler.UpdateCatalogHandler(useCaseUpdateCatalog))
	grp.Post("/product/create", middlewares.NewRequiresRealmRole("admin"),
		productHandler.CreateProductHandler(useCaseCreateProduct))
	grp.Post("/selectable/create", middlewares.NewRequiresRealmRole("admin"),
		selectableHandler.CreateSelectableHandler(useCaseCreateSelectable))
}
