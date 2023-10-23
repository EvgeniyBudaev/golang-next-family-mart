package api

import (
	"encoding/json"
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

func initAuthHeaders(writer http.ResponseWriter) {
	writer.Header().Set("Content-Type", "application/json")
}

func (a *AuthHandler) PostAuthenticate(writer http.ResponseWriter, req *http.Request) {
	initAuthHeaders(writer)
	logger.Log.Info("post to auth POST /api/v1/user/auth")
	var params model.AuthParams
	err := json.NewDecoder(req.Body).Decode(&params)
	if err != nil {
		logger.Log.Info(
			"Error while User.PostAuth. Invalid json received from client:",
			zap.Error(err))
		msg := Message{
			StatusCode: http.StatusBadRequest,
			Message:    "Provided json is invalid",
			IsError:    true,
		}
		writer.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(writer).Encode(msg)
		return
	}
	userInDB, ok, err := a.userStore.FindByEmail(req.Context(), params.Email)
	if err != nil {
		logger.Log.Info(
			"Error while User.PostAuth. Can't make user search in database",
			zap.Error(err))
		msg := Message{
			StatusCode: http.StatusInternalServerError,
			Message:    "We have some troubles while accessing database",
			IsError:    true,
		}
		writer.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(writer).Encode(msg)
		return
	}
	if !ok {
		logger.Log.Info("Error while User.PostAuth. User with that login does not exists")
		msg := Message{
			StatusCode: http.StatusBadRequest,
			Message:    "User with that email doesn't exists in database. Try register first",
			IsError:    true,
		}
		writer.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(writer).Encode(msg)
		return
	}
	if !isValidPassword(userInDB.EncryptedPassword, params.Password) {
		logger.Log.Info("Error while User.PostAuth. Invalid credentials to auth")
		msg := Message{
			StatusCode: http.StatusNotFound,
			Message:    "Your password is invalid",
			IsError:    true,
		}
		writer.WriteHeader(http.StatusNotFound)
		json.NewEncoder(writer).Encode(msg)
		return
	}
	tokenPair, err := generateTokenPair()
	if err != nil {
		logger.Log.Info("Error while User.PostAuth. Can't claim jwt-token", zap.Error(err))
		msg := Message{
			StatusCode: http.StatusInternalServerError,
			Message:    "We have some troubles. Try again",
			IsError:    true,
		}
		writer.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(writer).Encode(msg)
		return
	}
	msg := model.AuthResponse{
		AccessToken:      tokenPair["accessToken"],
		ExpiresIn:        tokenPair["expiresIn"],
		RefreshExpiresIn: tokenPair["refreshExpiresIn"],
		RefreshToken:     tokenPair["refreshToken"],
		StatusCode:       http.StatusCreated,
		Success:          true,
		TokenType:        "Bearer",
		UserID:           userInDB.ID,
	}
	writer.WriteHeader(http.StatusCreated)
	json.NewEncoder(writer).Encode(msg)
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
