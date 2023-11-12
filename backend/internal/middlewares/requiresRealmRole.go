package middlewares

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/gorilla/mux"
	"go.uber.org/zap"
	"net/http"
)

func RequiresRealmRole(role string) mux.MiddlewareFunc {
	return func(h http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			logger.Log.Info("RequiresRealmRole!", zap.String("ROLE: ", role))
			h.ServeHTTP(w, r)
		})
	}
}
