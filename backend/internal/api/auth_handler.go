package api

import (
	"encoding/json"
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/useCase/user"
	"go.uber.org/zap"
	"net/http"
)

type AuthHandler struct {
	useCase *user.RegisterUseCase
}

func NewAuthHandler(useCase *user.RegisterUseCase) *AuthHandler {
	return &AuthHandler{
		useCase: useCase,
	}
}

func initAuthHeaders(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
}

func (a *AuthHandler) PostRegisterHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	initAuthHeaders(w)
	logger.Log.Info("post to auth POST /api/v1/user/register")
	var params user.RegisterRequest
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		logger.Log.Debug(
			"error while auth_handler.PostRegister. Invalid json received from client",
			zap.Error(err))
		msg := fmt.Errorf("provided json is invalid")
		WrapError(w, msg, http.StatusBadRequest)
		return
	}
	response, err := a.useCase.Register(ctx, params)
	if err != nil {
		logger.Log.Debug(
			"error while auth_handler.PostRegister. Invalid json received from client",
			zap.Error(err))
		msg := fmt.Errorf("register is invalid")
		WrapError(w, msg, http.StatusBadRequest)
		return
	}
	WrapCreated(w, response)
}
