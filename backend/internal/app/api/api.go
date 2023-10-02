package api

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/app/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/app/storage"
	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
	"go.uber.org/zap"
	"net/http"
)

type API struct {
	config  *Config
	logger  *logrus.Logger
	router  *mux.Router
	storage *storage.Storage
}

func New(config *Config) *API {
	return &API{
		config: config,
		logger: logrus.New(),
		router: mux.NewRouter(),
	}
}

func (api *API) Start() error {
	// Логирование Logrus
	if err := api.configureLogger(); err != nil {
		return err
	}
	api.logger.Info("starting api server at port: ", api.config.Port)
	// Логирование Zap
	if err := logger.Initialize(api.config.LoggerLevel); err != nil {
		return err
	}
	logger.Log.Info("Running server", zap.String("port", api.config.Port))

	api.configureRouter()
	if err := api.configureStorage(); err != nil {
		return err
	}
	return http.ListenAndServe(api.config.Port, api.router)
}
