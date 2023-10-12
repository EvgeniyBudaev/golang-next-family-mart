package api

import (
	"encoding/json"
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/middleware"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/models"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/store"
	"github.com/form3tech-oss/jwt-go"
	"go.uber.org/zap"
	"net/http"
	"time"
)

type AuthHandler struct {
	userStore *store.UserStore
}

func NewAuthHandler(userStore *store.UserStore) *AuthHandler {
	return &AuthHandler{
		userStore: userStore,
	}
}

func initAuthHeaders(writer http.ResponseWriter) {
	writer.Header().Set("Content-Type", "application/json")
}

func (ah *AuthHandler) PostRegisterUser(writer http.ResponseWriter, req *http.Request) {
	initAuthHeaders(writer)
	logger.Log.Info("register user POST /api/v1/user/register")
	var user models.User
	err := json.NewDecoder(req.Body).Decode(&user)
	if err != nil {
		logger.Log.Info("Error while User.PostRegisterUser. Invalid json received from client")
		msg := Message{
			StatusCode: http.StatusBadRequest,
			Message:    "Provided json is invalid",
			IsError:    true,
		}
		writer.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(writer).Encode(msg)
		return
	}
	_, ok, err := ah.userStore.FindByEmail(user.Email)
	if err != nil {
		logger.Log.Info(
			"Error while User.PostRegisterUser. Troubles while accessing database table (users) with id. err:",
			zap.Error(err))
		msg := Message{
			StatusCode: http.StatusInternalServerError,
			Message:    "We have some troubles to accessing database. Try again",
			IsError:    true,
		}
		writer.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(writer).Encode(msg)
		return
	}
	if ok {
		logger.Log.Info("Error while User.PostRegisterUser. User with that ID already exists")
		msg := Message{
			StatusCode: http.StatusBadRequest,
			Message:    "User with that email already exists in database",
			IsError:    true,
		}
		writer.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(writer).Encode(msg)
		return
	}
	userAdd, err := ah.userStore.Create(&user)
	if err != nil {
		logger.Log.Info(
			"Error while User.PostRegisterUser. Troubles while accessing database table (users) with id. err:",
			zap.Error(err))
		msg := Message{
			StatusCode: http.StatusInternalServerError,
			Message:    "We have some troubles to accessing database. Try again",
			IsError:    true,
		}
		writer.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(writer).Encode(msg)
		return
	}
	msg := Message{
		StatusCode: http.StatusCreated,
		Message:    fmt.Sprintf("User {email:%s} successfully registered!", userAdd.Email),
		IsError:    true,
	}
	writer.WriteHeader(http.StatusCreated)
	json.NewEncoder(writer).Encode(msg)
}

func (ah *AuthHandler) PostAuth(writer http.ResponseWriter, req *http.Request) {
	initAuthHeaders(writer)
	logger.Log.Info("post to auth POST /api/v1/user/auth")
	var userFromJson models.User
	err := json.NewDecoder(req.Body).Decode(&userFromJson)
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
	userInDB, ok, err := ah.userStore.FindByEmail(userFromJson.Email)
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
	if userInDB.Password != userFromJson.Password {
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
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["exp"] = time.Now().Add(time.Hour * 2).Unix()
	claims["admin"] = true
	claims["name"] = userInDB.Email
	tokenString, err := token.SignedString(middleware.SecretKey)
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
	msg := Message{
		StatusCode: http.StatusCreated,
		Message:    tokenString,
		IsError:    false,
	}
	writer.WriteHeader(http.StatusCreated)
	json.NewEncoder(writer).Encode(msg)
}
