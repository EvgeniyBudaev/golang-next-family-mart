package api

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/storage"
	"net/http"
)

func (api *API) configureRouterField() {
	api.router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello! This is REST API"))
	})
}

func (api *API) configureStorageField() error {
	storageNew := storage.New(api.config.Storage)
	if err := storageNew.Open(); err != nil {
		return err
	}
	api.storage = storageNew
	return nil
}
