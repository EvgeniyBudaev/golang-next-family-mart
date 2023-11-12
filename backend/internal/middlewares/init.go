package middlewares

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"net/http"
)

func InitMiddlewares(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logger.Log.Info("InitMiddlewares!")
		h.ServeHTTP(w, r)
	})
}
