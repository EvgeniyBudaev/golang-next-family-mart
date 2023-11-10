package api

import (
	"encoding/json"
	error2 "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/error"
	"net/http"
)

func WrapError(w http.ResponseWriter, err error, httpStatusCode int) {
	msg := error2.ErrorResponse{
		StatusCode: httpStatusCode,
		Success:    false,
		Message:    err.Error(),
	}
	w.WriteHeader(httpStatusCode)
	json.NewEncoder(w).Encode(msg)
}

func WrapOk(w http.ResponseWriter, data interface{}) {
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(data)
}

func WrapCreated(w http.ResponseWriter, data interface{}) {
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(data)
}
