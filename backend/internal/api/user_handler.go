package api

import (
	"encoding/json"
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/model"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/store"
	"github.com/gorilla/mux"
	"go.uber.org/zap"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"regexp"
	"strconv"
)

const (
	bcryptCost     = 12
	minPasswordLen = 2
)

type UserHandler struct {
	userStore store.UserStore
}

func NewUserHandler(userStore store.UserStore) *UserHandler {
	return &UserHandler{
		userStore: userStore,
	}
}

func initUserHeaders(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
}

func (u *UserHandler) CreateUser(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	initUserHeaders(w)
	logger.Log.Info("register user POST /api/v1/user/register")
	var params model.CreateUserParams
	err := json.NewDecoder(req.Body).Decode(&params)
	if err != nil {
		logger.Log.Debug(
			"error while User.PostRegisterUser. Invalid json received from client",
			zap.Error(err))
		msg := fmt.Errorf("provided json is invalid")
		WrapError(w, msg, http.StatusBadRequest)
		return
	}
	if errors := validate(params); len(errors) > 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(errors)
		return
	}
	_, ok, err := u.userStore.FindByEmail(ctx, params.Email)
	if err != nil {
		logger.Log.Debug(
			"error while User.PostRegisterUser. Troubles while accessing database table (users) with id. err:",
			zap.Error(err))
		msg := fmt.Errorf("we have some troubles to accessing database. Try again")
		WrapError(w, msg, http.StatusInternalServerError)
		return
	}
	if ok {
		logger.Log.Debug("error while User.PostRegisterUser. User with that ID already exists")
		msg := fmt.Errorf("user with that email already exists in database")
		WrapError(w, msg, http.StatusBadRequest)
		return
	}
	user, err := NewUserFromParams(params)
	if err != nil {
		logger.Log.Debug("error while User.PostRegisterUser. Invalid json received from client")
		msg := fmt.Errorf("provided json is invalid")
		WrapError(w, msg, http.StatusBadRequest)
		return
	}
	userCreated, err := u.userStore.Create(ctx, user)
	if err != nil {
		logger.Log.Info(
			"error while User.PostRegisterUser. Troubles while accessing database table (users) with id. err:",
			zap.Error(err))
		msg := fmt.Errorf("we have some troubles to accessing database. Try again")
		WrapError(w, msg, http.StatusInternalServerError)
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
		Success:          true,
		TokenType:        "Bearer",
		UserID:           userCreated.ID,
	}
	WrapCreated(w, msg)
}

func (u *UserHandler) GetUserList(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	initUserHeaders(w)
	logger.Log.Info("get user list GET /api/v1/users")
	userList, err := u.userStore.SelectAll(ctx)
	if err != nil {
		logger.Log.Debug("error while User.GetUserList:", zap.Error(err))
		msg := fmt.Errorf("we have some troubles to accessing database. Try again later")
		WrapError(w, msg, http.StatusNotImplemented)
		return
	}
	WrapOk(w, userList)
}

func (u *UserHandler) GetUserById(w http.ResponseWriter, req *http.Request) {
	ctx := req.Context()
	initUserHeaders(w)
	logger.Log.Info("get user by id GET /api/v1/users/{id}")
	id, err := strconv.Atoi(mux.Vars(req)["id"])
	if err != nil {
		logger.Log.Debug("error while User.GetUserById. Troubles while parsing {id} param:", zap.Error(err))
		msg := fmt.Errorf("unappropriated id value. Don't use ID as uncasting to int value")
		WrapError(w, msg, http.StatusBadRequest)
		return
	}
	user, ok, err := u.userStore.FindById(ctx, id)
	if err != nil {
		logger.Log.Debug(
			"error while User.GetUserById. Troubles while accessing database table (users) with id. err:",
			zap.Error(err))
		msg := fmt.Errorf("error while User.GetUserById."+
			" Troubles while accessing database table (users) with id: %d", id)
		WrapError(w, msg, http.StatusInternalServerError)
		return
	}
	if !ok {
		logger.Log.Debug("error while User.GetUserById. Can't find article with that ID in database")
		msg := fmt.Errorf("user with that ID: %d does not exists in database", id)
		WrapError(w, msg, http.StatusNotFound)
		return
	}
	WrapOk(w, user)
}

func NewUserFromParams(params model.CreateUserParams) (*model.User, error) {
	encpw, err := bcrypt.GenerateFromPassword([]byte(params.Password), bcryptCost)
	if err != nil {
		return nil, err
	}
	return &model.User{
		Email:             params.Email,
		EncryptedPassword: string(encpw),
	}, nil
}

func isValidPassword(encpw, pw string) bool {
	return bcrypt.CompareHashAndPassword([]byte(encpw), []byte(pw)) == nil
}

func isEmailValid(e string) bool {
	emailRegex := regexp.MustCompile(`^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$`)
	return emailRegex.MatchString(e)
}

func validate(params model.CreateUserParams) map[string]string {
	errors := map[string]string{}
	if len(params.Password) < minPasswordLen {
		errors["password"] = fmt.Sprintf("password length should be at least %d characters", minPasswordLen)
	}
	if !isEmailValid(params.Email) {
		errors["email"] = fmt.Sprintf("email is invalid")
	}
	return errors
}
