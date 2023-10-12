package api

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/config"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/middleware"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/store"
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

type Message struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
	IsError    bool   `json:"is_error"`
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
	api.logger.Info("starting api server at port: ", api.config.Port)
	// Zap
	if err := logger.Initialize(api.config.LoggerLevel); err != nil {
		return err
	}
	logger.Log.Info("Running server", zap.String("port", api.config.Port))

	// Store
	storeNew := store.NewStore(api.config)
	if err := storeNew.Open(); err != nil {
		logger.Log.Error("store don't open", zap.Error(err))
		return err
	}
	api.store = storeNew
	userStore := storeNew.UserStore()

	// handlers
	userHandler := NewUserHandler(userStore)
	authHandler := NewAuthHandler(userStore)

	// admin user handlers
	api.router.Handle(prefix+"/admin/users", middleware.JwtMiddleware.Handler(
		http.HandlerFunc(userHandler.GetUserList),
	)).Methods(http.MethodGet)
	api.router.Handle(prefix+"/admin/users/{id}", middleware.JwtMiddleware.Handler(
		http.HandlerFunc(userHandler.GetUserById),
	)).Methods(http.MethodGet)

	// user handlers
	api.router.HandleFunc(prefix+"/users/{id}", userHandler.GetUserById).Methods(http.MethodGet)

	// auth handlers
	api.router.HandleFunc(prefix+"/user/register", authHandler.PostRegisterUser).Methods(http.MethodPost)
	api.router.HandleFunc(prefix+"/user/auth", authHandler.PostAuth).Methods(http.MethodPost)

	return http.ListenAndServe(api.config.Port, api.router)
}
