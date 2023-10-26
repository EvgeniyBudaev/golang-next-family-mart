package api

import (
	"encoding/json"
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/middleware"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/model"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/store"
	"github.com/form3tech-oss/jwt-go"
	"go.uber.org/zap"
	"net/http"
	"time"
)

type AuthHandler struct {
	userStore store.UserStore
}

func NewAuthHandler(userStore store.UserStore) *AuthHandler {
	return &AuthHandler{
		userStore: userStore,
	}
}

func initAuthHeaders(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
}

func (a *AuthHandler) PostAuthenticate(w http.ResponseWriter, req *http.Request) {
	initAuthHeaders(w)
	logger.Log.Info("post to auth POST /api/v1/user/auth")
	var params model.AuthParams
	err := json.NewDecoder(req.Body).Decode(&params)
	if err != nil {
		logger.Log.Debug(
			"error while User.PostAuth. Invalid json received from client:",
			zap.Error(err))
		msg := fmt.Errorf("provided json is invalid")
		WrapError(w, msg, http.StatusBadRequest)
		return
	}
	userInDB, ok, err := a.userStore.FindByEmail(req.Context(), params.Email)
	if err != nil {
		logger.Log.Debug(
			"error while User.PostAuth. Can't make user search in database",
			zap.Error(err))
		msg := fmt.Errorf("we have some troubles while accessing database")
		WrapError(w, msg, http.StatusInternalServerError)
		return
	}
	if !ok {
		logger.Log.Debug("error while User.PostAuth. User with that login does not exists")
		msg := fmt.Errorf("user with that email doesn't exists in database. Try register first")
		WrapError(w, msg, http.StatusBadRequest)
		return
	}
	if !isValidPassword(userInDB.EncryptedPassword, params.Password) {
		logger.Log.Debug("error while User.PostAuth. Invalid credentials to auth")
		msg := fmt.Errorf("your password is invalid")
		WrapError(w, msg, http.StatusNotFound)
		return
	}
	tokenPair, err := generateTokenPair()
	if err != nil {
		logger.Log.Debug("error while User.PostAuth. Can't claim jwt-token", zap.Error(err))
		msg := fmt.Errorf("we have some troubles. Try again")
		WrapError(w, msg, http.StatusInternalServerError)
		return
	}
	msg := model.AuthResponse{
		AccessToken:      tokenPair["accessToken"],
		ExpiresIn:        tokenPair["expiresIn"],
		RefreshExpiresIn: tokenPair["refreshExpiresIn"],
		RefreshToken:     tokenPair["refreshToken"],
		StatusCode:       http.StatusCreated,
		TokenType:        "Bearer",
		UserID:           userInDB.ID,
	}
	WrapCreated(w, msg)
}

func generateTokenPair() (map[string]string, error) {
	accessToken := jwt.New(jwt.SigningMethodHS256)
	expiresIn := time.Now().Add(time.Minute * 5).Format(time.RFC3339)
	claims := accessToken.Claims.(jwt.MapClaims)
	claims["exp"] = expiresIn
	t, err := accessToken.SignedString(middleware.SecretKey)
	if err != nil {
		return nil, err
	}
	refreshToken := jwt.New(jwt.SigningMethodHS256)
	rtClaims := refreshToken.Claims.(jwt.MapClaims)
	refreshExpiresIn := time.Now().Add(time.Minute * 10).Format(time.RFC3339)
	rtClaims["exp"] = refreshExpiresIn
	rt, err := refreshToken.SignedString(middleware.SecretKey)
	if err != nil {
		return nil, err
	}
	return map[string]string{
		"accessToken":      t,
		"expiresIn":        expiresIn,
		"refreshExpiresIn": refreshExpiresIn,
		"refreshToken":     rt,
	}, nil
}
