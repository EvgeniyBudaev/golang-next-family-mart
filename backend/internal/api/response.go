package api

import (
	"encoding/json"
	errorResponse "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/error"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/success"
	"net/http"
)

func WrapError(w http.ResponseWriter, err error, httpStatusCode int) {
	msg := errorResponse.ErrorResponse{
		StatusCode: httpStatusCode,
		Success:    false,
		Message:    err.Error(),
	}
	w.WriteHeader(httpStatusCode)
	json.NewEncoder(w).Encode(msg)
}

func WrapOk(w http.ResponseWriter, data interface{}) {
	msg := success.Success{
		Data:       data,
		StatusCode: http.StatusOK,
		Success:    true,
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(msg)
}

func WrapCreated(w http.ResponseWriter, data interface{}) {
	msg := success.Success{
		Data:       data,
		StatusCode: http.StatusCreated,
		Success:    true,
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(msg)
}
