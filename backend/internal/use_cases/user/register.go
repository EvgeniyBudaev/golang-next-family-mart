package user

import (
	"context"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/model"
	"github.com/Nerzal/gocloak/v13"
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
	identityManager model.IIdentityManager
}

func NewRegisterUseCase(im model.IIdentityManager) *RegisterUseCase {
	return &RegisterUseCase{
		identityManager: im,
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
		(*user.Attributes)["mobile"] = []string{request.MobileNumber}
	}

	userResponse, err := uc.identityManager.CreateUser(ctx, user, request.Password, "customer")
	if err != nil {
		return nil, err
	}

	var response = &RegisterResponse{User: userResponse}
	return response, nil
}
