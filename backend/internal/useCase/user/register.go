package user

import (
	"context"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/Nerzal/gocloak/v13"
	"go.uber.org/zap"
	"strings"
)

type RegisterRequest struct {
	Username     string `json:"username"`
	Password     string `json:"password"`
	FirstName    string `json:"firstName"`
	LastName     string `json:"lastName"`
	Email        string `json:"email"`
	MobileNumber string
}

type RegisterResponse struct {
	User *gocloak.User
}

type RegisterUseCase struct {
	identity IIdentity
}

func NewRegisterUseCase(i IIdentity) *RegisterUseCase {
	return &RegisterUseCase{
		identity: i,
	}
}

func (uc *RegisterUseCase) Register(ctx context.Context, request RegisterRequest) (*RegisterResponse, error) {
	var user = gocloak.User{
		Username:      gocloak.StringP(request.Username),
		FirstName:     gocloak.StringP(request.FirstName),
		LastName:      gocloak.StringP(request.LastName),
		Email:         gocloak.StringP(request.Email),
		EmailVerified: gocloak.BoolP(true),
		Enabled:       gocloak.BoolP(true),
		Attributes:    &map[string][]string{},
	}
	if strings.TrimSpace(request.MobileNumber) != "" {
		(*user.Attributes)["mobileNumber"] = []string{request.MobileNumber}
	}
	userResponse, err := uc.identity.CreateUser(ctx, user, request.Password, "customer")
	if err != nil {
		logger.Log.Debug("error while Register. Error in CreateUser", zap.Error(err))
		return nil, err
	}
	var response = &RegisterResponse{User: userResponse}
	return response, nil
}
