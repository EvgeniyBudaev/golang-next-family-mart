package api

import (
	"encoding/json"
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/middleware"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/models"
	"github.com/form3tech-oss/jwt-go"
	"github.com/gorilla/mux"
	"go.uber.org/zap"
	"net/http"
	"strconv"
	"time"
)

type Message struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
	IsError    bool   `json:"is_error"`
}

func initHeaders(writer http.ResponseWriter) {
	writer.Header().Set("Content-Type", "application/json")
}

func (api *API) GetUserList(writer http.ResponseWriter, req *http.Request) {
	initHeaders(writer)
	logger.Log.Info("get user list GET /api/v1/users")
	userList, err := api.storage.User().SelectAll()
	if err != nil {
		logger.Log.Info("Error while User.GetUserList:", zap.Error(err))
		msg := Message{
			StatusCode: http.StatusNotImplemented,
			Message:    "We have some troubles to accessing database. Try again later",
			IsError:    true,
		}
		writer.WriteHeader(http.StatusNotImplemented)
		json.NewEncoder(writer).Encode(msg)
		return
	}
	writer.WriteHeader(http.StatusOK)
	json.NewEncoder(writer).Encode(userList)
}

func (api *API) GetUserById(writer http.ResponseWriter, req *http.Request) {
	initHeaders(writer)
	logger.Log.Info("get user by id GET /api/v1/users/{id}")
	id, err := strconv.Atoi(mux.Vars(req)["id"])
	if err != nil {
		logger.Log.Info("Error while User.GetUserById. Troubles while parsing {id} param:", zap.Error(err))
		msg := Message{
			StatusCode: http.StatusBadRequest,
			Message:    "Unappropriated id value. Don't use ID as uncasting to int value",
			IsError:    true,
		}
		writer.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(writer).Encode(msg)
		return
	}
	user, ok, err := api.storage.User().FindById(id)
	if err != nil {
		logger.Log.Info(
			"Error while User.GetUserById. Troubles while accessing database table (users) with id. err:",
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
	if !ok {
		logger.Log.Info("Error while User.GetUserById. Can't find article with that ID in database")
		msg := Message{
			StatusCode: http.StatusNotFound,
			Message:    "User with that ID does not exists in database",
			IsError:    true,
		}
		writer.WriteHeader(http.StatusNotFound)
		json.NewEncoder(writer).Encode(msg)
		return
	}
	writer.WriteHeader(http.StatusOK)
	json.NewEncoder(writer).Encode(user)
}

func (api *API) PostRegisterUser(writer http.ResponseWriter, req *http.Request) {
	initHeaders(writer)
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
	_, ok, err := api.storage.User().FindByEmail(user.Email)
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
	userAdd, err := api.storage.User().Create(&user)
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

func (api *API) PostAuth(writer http.ResponseWriter, req *http.Request) {
	initHeaders(writer)
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
	userInDB, ok, err := api.storage.User().FindByEmail(userFromJson.Email)
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
