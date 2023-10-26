package api

import (
	"encoding/json"
	"net/http"
)

type ErrorResponse struct {
	Message    error `json:"message"`
	Success    bool  `json:"success"`
	StatusCode int   `json:"status_code"`
}

func WrapError(w http.ResponseWriter, err error, httpStatusCode int) {
	msg := ErrorResponse{
		StatusCode: httpStatusCode,
		Success:    false,
		Message:    err,
	}
	w.WriteHeader(httpStatusCode)
	json.NewEncoder(w).Encode(msg)
}

func WrapOk(w http.ResponseWriter, data interface{}) {
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(data)
}
