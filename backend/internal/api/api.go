package api

import (
	"context"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/config"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/identity"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/store"
	catalogStore "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/store/catalog"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/useCase/catalog"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/useCase/user"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
	"go.uber.org/zap"
	"net/http"
)

var (
	prefix string = "/api/v1"
)

type API struct {
	config *config.Config
	logger *logrus.Logger
	router *mux.Router
	store  *store.Store
}

func NewAPI(config *config.Config) *API {
	return &API{
		config: config,
		logger: logrus.New(),
		router: mux.NewRouter(),
	}
}

func (api *API) Start() error {
	// Логирование
	// Logrus
	logLevel, err := logrus.ParseLevel(api.config.LoggerLevel)
	if err != nil {
		return err
	}
	api.logger.SetLevel(logLevel)
	// api.logger.Info("starting api server at port: ", api.config.Port)
	// Zap
	if err := logger.Initialize(api.config.LoggerLevel); err != nil {
		return err
	}
	logger.Log.Info("Running server", zap.String("port", api.config.Port))

	// Store
	newStore := store.NewStore(api.config)
	if err := newStore.Open(); err != nil {
		return err
	}
	api.store = newStore
	catalogDataStore := catalogStore.NewDBCatalogStore(newStore)

	identityManager := identity.NewIdentity(api.config)
	registerUseCase := user.NewRegisterUseCase(identityManager)
	useCaseCreateCatalog := catalog.NewCreateCatalogUseCase(catalogDataStore)
	useCaseGetCatalogList := catalog.NewGetCatalogListUseCase(catalogDataStore)

	// handlers
	authHandler := NewAuthHandler(registerUseCase)
	catalogHandler := NewCatalogHandler(useCaseCreateCatalog, useCaseGetCatalogList)

	// CORS
	headersOk := handlers.AllowedHeaders([]string{"Content-Type", "X-Requested-With", "Authorization"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"Get", "POST", "PUT", "DELETE", "OPTIONS"})

	// handlers
	api.router.HandleFunc(prefix+"/user/register", authHandler.PostRegisterHandler).Methods(http.MethodPost)
	api.router.HandleFunc(prefix+"/catalog/create", catalogHandler.PostCatalogCreateHandler).Methods(http.MethodPost)
	api.router.HandleFunc(prefix+"/catalog/all", catalogHandler.GetCatalogListHandler).Methods(http.MethodGet)

	return http.ListenAndServe(api.config.Port, handlers.CORS(originsOk, headersOk, methodsOk)(api.router))
}

func (api *API) contextMiddleware(ctx context.Context, h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h.ServeHTTP(w, r.WithContext(ctx))
	})
}
