package model

import (
	"context"
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/config"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/Nerzal/gocloak/v13"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"strings"
)

type IIdentityManager interface {
	CreateUser(ctx context.Context, user gocloak.User, password string, role string) (*gocloak.User, error)
}

type IdentityManager struct {
	BaseUrl             string
	Realm               string
	RestApiClientId     string
	RestApiClientSecret string
}

func NewIdentityManager(config *config.Config) *IdentityManager {
	return &IdentityManager{
		BaseUrl:             config.BaseUrl,
		Realm:               config.Realm,
		RestApiClientId:     config.ClientId,
		RestApiClientSecret: config.ClientSecret,
	}
}

func (im *IdentityManager) loginRestApiClient(ctx context.Context) (*gocloak.JWT, error) {
	client := gocloak.NewClient(im.BaseUrl)

	token, err := client.LoginClient(ctx, im.RestApiClientId, im.RestApiClientSecret, im.Realm)
	if err != nil {
		logger.Log.Debug(
			"error while identity_manager_store.loginRestApiClient. Unable to login the rest client",
			zap.Error(err))
		return nil, errors.Wrap(err, "unable to login the rest client")
	}
	return token, nil
}

func (im *IdentityManager) CreateUser(ctx context.Context, user gocloak.User, password string, role string) (*gocloak.User, error) {

	token, err := im.loginRestApiClient(ctx)
	if err != nil {
		return nil, err
	}

	client := gocloak.NewClient(im.BaseUrl)

	userId, err := client.CreateUser(ctx, token.AccessToken, im.Realm, user)
	if err != nil {
		return nil, errors.Wrap(err, "unable to create the user")
	}

	err = client.SetPassword(ctx, token.AccessToken, userId, im.Realm, password, false)
	if err != nil {
		return nil, errors.Wrap(err, "unable to set the password for the user")
	}

	var roleNameLowerCase = strings.ToLower(role)
	roleKeycloak, err := client.GetRealmRole(ctx, token.AccessToken, im.Realm, roleNameLowerCase)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf("unable to get role by name: '%v'", roleNameLowerCase))
	}
	err = client.AddRealmRoleToUser(ctx, token.AccessToken, im.Realm, userId, []gocloak.Role{
		*roleKeycloak,
	})
	if err != nil {
		return nil, errors.Wrap(err, "unable to add a realm role to user")
	}

	userKeycloak, err := client.GetUserByID(ctx, token.AccessToken, im.Realm, userId)
	if err != nil {
		return nil, errors.Wrap(err, "unable to get recently created user")
	}

	return userKeycloak, nil
}
