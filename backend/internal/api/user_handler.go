package api

import (
	"encoding/json"
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/store"
	"github.com/gorilla/mux"
	"go.uber.org/zap"
	"net/http"
	"strconv"
)

type UserHandler struct {
	userStore store.UserStore
}

func NewUserHandler(userStore store.UserStore) *UserHandler {
	return &UserHandler{
		userStore: userStore,
	}
}

func initUserHeaders(writer http.ResponseWriter) {
	writer.Header().Set("Content-Type", "application/json")
}

func (u *UserHandler) GetUserList(writer http.ResponseWriter, req *http.Request) {
	initUserHeaders(writer)
	logger.Log.Info("get user list GET /api/v1/users")
	userList, err := u.userStore.SelectAll(req.Context())
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

func (u *UserHandler) GetUserById(writer http.ResponseWriter, req *http.Request) {
	initUserHeaders(writer)
	logger.Log.Info("get user by id GET /api/v1/users/{id}")
	id, err := strconv.Atoi(mux.Vars(req)["id"])
	if err != nil {
		logger.Log.Debug("Error while User.GetUserById. Troubles while parsing {id} param:", zap.Error(err))
		msg := fmt.Errorf("unappropriated id value. Don't use ID as uncasting to int value")
		writer.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(writer).Encode(msg)
		return
	}
	user, ok, err := u.userStore.FindById(req.Context(), id)
	if err != nil {
		logger.Log.Debug(
			"Error while User.GetUserById. Troubles while accessing database table (users) with id. err:",
			zap.Error(err))
		msg := fmt.Errorf("error while User.GetUserById."+
			" Troubles while accessing database table (users) with id: %d", id)
		writer.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(writer).Encode(msg)
		return
	}
	if !ok {
		logger.Log.Debug("Error while User.GetUserById. Can't find article with that ID in database")
		msg := fmt.Errorf("user with that ID: %d does not exists in database", id)
		fmt.Println(msg)
		writer.WriteHeader(http.StatusNotFound)
		json.NewEncoder(writer).Encode(msg)
		return
	}
	writer.WriteHeader(http.StatusOK)
	json.NewEncoder(writer).Encode(user)
}
