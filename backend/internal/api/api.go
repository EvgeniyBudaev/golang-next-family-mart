package api

import (
	"context"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/api/routes"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/config"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/middlewares"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
	"go.uber.org/zap"
	"net/http"
)

type API struct {
	config *config.Config
	logger *logrus.Logger
	router *mux.Router
	store  *postgres.Store
}

func NewAPI(config *config.Config) *API {
	return &API{
		config: config,
		logger: logrus.New(),
		router: mux.NewRouter(),
	}
}

func (api *API) Start() error {
	// Инициализация
	app := fiber.New()

	// Логирование
	// Logrus
	logLevel, err := logrus.ParseLevel(api.config.LoggerLevel)
	if err != nil {
		logger.Log.Debug("error while Start. Error in ParseLevel", zap.Error(err))
		return err
	}
	api.logger.SetLevel(logLevel)
	// api.logger.Info("starting api server at port: ", api.config.Port)
	// Zap
	if err := logger.Initialize(api.config.LoggerLevel); err != nil {
		logger.Log.Debug("error while Start. Error in Initialize", zap.Error(err))
		return err
	}
	logger.Log.Info("Running server", zap.String("port", api.config.Port))

	// Store
	newStore := postgres.NewStore(api.config)
	if err := newStore.Open(); err != nil {
		logger.Log.Debug("error while Start. Error in NewStore", zap.Error(err))
		return err
	}
	api.store = newStore

	// CORS
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Content-Type, X-Requested-With, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	// middlewares
	middlewares.InitFiberMiddlewares(app, api.config, newStore, routes.InitPublicRoutes, routes.InitProtectedRoutes)

	return app.Listen(api.config.Port)
}

func (api *API) contextMiddleware(ctx context.Context, h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		h.ServeHTTP(w, r.WithContext(ctx))
	})
}
