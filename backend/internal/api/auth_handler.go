package api

import (
	"encoding/json"
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/middleware"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/model"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/store"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/use_cases/user"
	"github.com/golang-jwt/jwt/v5"
	"go.uber.org/zap"
	"net/http"
	"strconv"
	"time"
)

type TokenPairs struct {
	AccessToken      string
	ExpiresIn        string
	RefreshExpiresIn string
	RefreshToken     string
}

type Claims struct {
	jwt.RegisteredClaims
}

type AuthHandler struct {
	auth      *model.Auth
	userStore store.UserStore
	useCase   *user.RegisterUseCase
}

func NewAuthHandler(userStore store.UserStore, auth *model.Auth, useCase *user.RegisterUseCase) *AuthHandler {
	return &AuthHandler{
		auth:      auth,
		userStore: userStore,
		useCase:   useCase,
	}
}

func initAuthHeaders(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
}

func (a *AuthHandler) RegisterHandler(w http.ResponseWriter, r *http.Request) {
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

func (a *AuthHandler) PostRegister(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	initUserHeaders(w)
	logger.Log.Info("register user POST /api/v1/auth/register")
	var params model.CreateUserParams
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		logger.Log.Debug(
			"error while auth_handler.PostRegister. Invalid json received from client",
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
	_, ok, err := a.userStore.FindByEmail(ctx, params.Email)
	if err != nil {
		logger.Log.Debug(
			"error while auth_handler.PostRegister. Troubles while accessing database table (users) with id. err:",
			zap.Error(err))
		msg := fmt.Errorf("we have some troubles to accessing database. Try again")
		WrapError(w, msg, http.StatusInternalServerError)
		return
	}
	if ok {
		logger.Log.Debug("error while auth_handler.PostRegister. User with that ID already exists")
		msg := fmt.Errorf("user with that email already exists in database")
		WrapError(w, msg, http.StatusBadRequest)
		return
	}
	user, err := NewUserFromParams(params)
	if err != nil {
		logger.Log.Debug("error while auth_handler.PostRegister. Invalid json received from client")
		msg := fmt.Errorf("provided json is invalid")
		WrapError(w, msg, http.StatusBadRequest)
		return
	}
	userCreated, err := a.userStore.Create(ctx, user)
	if err != nil {
		logger.Log.Info(
			"error while auth_handler.PostRegister. Troubles while accessing database table (users) with id. err:",
			zap.Error(err))
		msg := fmt.Errorf("we have some troubles to accessing database. Try again")
		WrapError(w, msg, http.StatusInternalServerError)
		return
	}
	tokenPair, err := a.generateTokenPair(userCreated)
	if err != nil {
		logger.Log.Debug("error while auth_handler.PostRegister. Can't claim jwt-token", zap.Error(err))
		msg := fmt.Errorf("we have some troubles. Try again")
		WrapError(w, msg, http.StatusInternalServerError)
		return
	}
	msg := model.AuthResponse{
		AccessToken:      tokenPair.AccessToken,
		ExpiresIn:        tokenPair.ExpiresIn,
		RefreshExpiresIn: tokenPair.RefreshExpiresIn,
		RefreshToken:     tokenPair.RefreshToken,
		StatusCode:       http.StatusCreated,
		Success:          true,
		TokenType:        "Bearer",
		UserID:           userCreated.ID,
	}
	WrapCreated(w, msg)
}

func (a *AuthHandler) PostAuthenticate(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	initAuthHeaders(w)
	logger.Log.Info("post to auth POST /api/v1/auth/login")
	var params model.AuthParams
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		logger.Log.Debug(
			"error while auth_handler.PostAuthenticate. Invalid json received from client:",
			zap.Error(err))
		msg := fmt.Errorf("provided json is invalid")
		WrapError(w, msg, http.StatusBadRequest)
		return
	}
	userInDB, ok, err := a.userStore.FindByEmail(ctx, params.Email)
	if err != nil {
		logger.Log.Debug(
			"error while auth_handler.PostAuthenticate. Can't make user search in database",
			zap.Error(err))
		msg := fmt.Errorf("we have some troubles while accessing database")
		WrapError(w, msg, http.StatusInternalServerError)
		return
	}
	if !ok {
		logger.Log.Debug("error while auth_handler.PostAuthenticate. User with that login does not exists")
		msg := fmt.Errorf("user with that email doesn't exists in database. Try register first")
		WrapError(w, msg, http.StatusBadRequest)
		return
	}
	if !isValidPassword(userInDB.EncryptedPassword, params.Password) {
		logger.Log.Debug("error while auth_handler.PostAuthenticate. Invalid credentials to auth")
		msg := fmt.Errorf("your password is invalid")
		WrapError(w, msg, http.StatusNotFound)
		return
	}
	tokenPair, err := a.generateTokenPair(userInDB)
	refreshCookie := a.getRefreshCookie(tokenPair.RefreshToken)
	http.SetCookie(w, refreshCookie)
	if err != nil {
		logger.Log.Debug("error while auth_handler.PostAuthenticate. Can't claim jwt-token", zap.Error(err))
		msg := fmt.Errorf("we have some troubles. Try again")
		WrapError(w, msg, http.StatusInternalServerError)
		return
	}
	msg := model.AuthResponse{
		AccessToken:      tokenPair.AccessToken,
		ExpiresIn:        tokenPair.ExpiresIn,
		RefreshExpiresIn: tokenPair.RefreshExpiresIn,
		RefreshToken:     tokenPair.RefreshToken,
		StatusCode:       http.StatusCreated,
		Success:          true,
		TokenType:        "Bearer",
		UserID:           userInDB.ID,
	}
	WrapCreated(w, msg)
}

func (a *AuthHandler) generateTokenPair(u *model.User) (TokenPairs, error) {
	accessToken := jwt.New(jwt.SigningMethodHS256)
	expiresIn := time.Now().Add(a.auth.TokenExpiry).Format(time.RFC3339)
	claims := accessToken.Claims.(jwt.MapClaims)
	claims["sub"] = u.ID
	claims["aud"] = a.auth.Audience
	claims["iss"] = a.auth.Issuer
	claims["iat"] = time.Now().UTC().Unix()
	claims["typ"] = "JWT"
	claims["exp"] = expiresIn
	signedAccessToken, err := accessToken.SignedString(middleware.SecretKey)
	if err != nil {
		return TokenPairs{}, err
	}
	refreshToken := jwt.New(jwt.SigningMethodHS256)
	refreshExpiresIn := time.Now().Add(a.auth.RefreshExpiry).Format(time.RFC3339)
	refreshTokenClaims := refreshToken.Claims.(jwt.MapClaims)
	refreshTokenClaims["sub"] = u.ID
	refreshTokenClaims["iat"] = time.Now().UTC().Unix()
	refreshTokenClaims["exp"] = refreshExpiresIn
	signedRefreshToken, err := refreshToken.SignedString(middleware.SecretKey)
	if err != nil {
		return TokenPairs{}, err
	}
	var tokenPairs = TokenPairs{
		AccessToken:      signedAccessToken,
		ExpiresIn:        expiresIn,
		RefreshExpiresIn: refreshExpiresIn,
		RefreshToken:     signedRefreshToken,
	}
	return tokenPairs, nil
}

func (a *AuthHandler) getRefreshCookie(refreshToken string) *http.Cookie {
	return &http.Cookie{
		Name:     a.auth.CookieName,
		Path:     a.auth.CookiePath,
		Value:    refreshToken,
		Expires:  time.Now().Add(a.auth.RefreshExpiry),
		MaxAge:   int(a.auth.RefreshExpiry.Seconds()),
		SameSite: http.SameSiteStrictMode,
		Domain:   a.auth.CookieDomain,
		HttpOnly: true,
		Secure:   true,
	}
}

func (a *AuthHandler) getExpiredRefreshCookie() *http.Cookie {
	return &http.Cookie{
		Name:     a.auth.CookieName,
		Path:     a.auth.CookiePath,
		Value:    "",
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
		SameSite: http.SameSiteStrictMode,
		Domain:   a.auth.CookieDomain,
		HttpOnly: true,
		Secure:   true,
	}
}

func (a *AuthHandler) RefreshToken(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	for _, cookie := range r.Cookies() {
		if cookie.Name == a.auth.CookieName {
			claims := &Claims{}
			refreshToken := cookie.Value
			_, err := jwt.ParseWithClaims(refreshToken, claims, func(token *jwt.Token) (interface{}, error) {
				return middleware.SecretKey, nil
			})
			if err != nil {
				msg := fmt.Errorf("unathorized")
				WrapError(w, msg, http.StatusUnauthorized)
				return
			}
			userID, err := strconv.Atoi(claims.Subject)
			if err != nil {
				msg := fmt.Errorf("unathorized")
				WrapError(w, msg, http.StatusUnauthorized)
				return
			}
			userInDB, ok, err := a.userStore.FindById(ctx, userID)
			if err != nil {
				logger.Log.Debug(
					"error while auth_handler.RefreshToken. Can't make user search in database",
					zap.Error(err))
				msg := fmt.Errorf("we have some troubles while accessing database")
				WrapError(w, msg, http.StatusInternalServerError)
				return
			}
			if !ok {
				logger.Log.Debug("error while auth_handler.RefreshToken. User with that login does not exists")
				msg := fmt.Errorf("user with that email doesn't exists in database. Try register first")
				WrapError(w, msg, http.StatusBadRequest)
				return
			}
			tokenPair, err := a.generateTokenPair(userInDB)
			if err != nil {
				logger.Log.Debug("error while auth_handler.RefreshToken. Can't claim jwt-token", zap.Error(err))
				msg := fmt.Errorf("we have some troubles. Try again")
				WrapError(w, msg, http.StatusInternalServerError)
				return
			}
			http.SetCookie(w, a.getRefreshCookie(tokenPair.RefreshToken))
			msg := model.AuthResponse{
				AccessToken:      tokenPair.AccessToken,
				ExpiresIn:        tokenPair.ExpiresIn,
				RefreshExpiresIn: tokenPair.RefreshExpiresIn,
				RefreshToken:     tokenPair.RefreshToken,
				StatusCode:       http.StatusCreated,
				Success:          true,
				TokenType:        "Bearer",
				UserID:           userInDB.ID,
			}
			WrapOk(w, msg)
		}
	}
}
