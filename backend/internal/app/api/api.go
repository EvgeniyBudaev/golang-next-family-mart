package api

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/internal/app/storage"
	"github.com/gorilla/mux"
	"net/http"
)

type API struct {
	config  *Config
	router  *mux.Router
	storage *storage.Storage
}

func New(config *Config) *API {
	return &API{
		config: config,
		router: mux.NewRouter(),
	}
}

func (api *API) Start() error {
	api.configureRouter()
	if err := api.configureStorage(); err != nil {
		return err
	}
	return http.ListenAndServe(api.config.Port, api.router)
}
