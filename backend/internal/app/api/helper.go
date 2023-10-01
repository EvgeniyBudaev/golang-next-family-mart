package api

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/internal/app/middleware"
	"github.com/EvgeniyBudaev/golang-next-family-mart/internal/app/storage"
	"net/http"
)

var (
	prefix string = "/api/v1"
)

func (api *API) configureRouter() {
	// admin user handlers
	api.router.Handle(prefix+"/admin/users", middleware.JwtMiddleware.Handler(
		http.HandlerFunc(api.GetUserList),
	)).Methods(http.MethodGet)
	api.router.Handle(prefix+"/admin/users/{id}", middleware.JwtMiddleware.Handler(
		http.HandlerFunc(api.GetUserById),
	)).Methods(http.MethodGet)

	// user handlers
	api.router.HandleFunc(prefix+"/users/{id}", api.GetUserById).Methods(http.MethodGet)

	// auth handlers
	api.router.HandleFunc(prefix+"/user/register", api.PostRegisterUser).Methods(http.MethodPost)
	api.router.HandleFunc(prefix+"/user/auth", api.PostAuth).Methods(http.MethodPost)
}

func (api *API) configureStorage() error {
	storageNew := storage.New(api.config.Storage)
	if err := storageNew.Open(); err != nil {
		return err
	}
	api.storage = storageNew
	return nil
}
