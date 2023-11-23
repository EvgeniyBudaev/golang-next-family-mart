package identity

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

type Identity struct {
	BaseUrl      string
	Realm        string
	ClientId     string
	ClientSecret string
}

func NewIdentity(config *config.Config) *Identity {
	return &Identity{
		BaseUrl:      config.BaseUrl,
		Realm:        config.Realm,
		ClientId:     config.ClientId,
		ClientSecret: config.ClientSecret,
	}
}

func (i *Identity) loginRestApiClient(ctx context.Context) (*gocloak.JWT, error) {
	client := gocloak.NewClient(i.BaseUrl)
	token, err := client.LoginClient(ctx, i.ClientId, i.ClientSecret, i.Realm)
	if err != nil {
		logger.Log.Debug(
			"error while identity.loginRestApiClient. Unable to login the rest client",
			zap.Error(err))
		return nil, errors.Wrap(err, "unable to login the rest client")
	}
	return token, nil
}

func (i *Identity) CreateUser(ctx context.Context, user gocloak.User, password string, role string) (*gocloak.User, error) {
	token, err := i.loginRestApiClient(ctx)
	if err != nil {
		return nil, err
	}
	client := gocloak.NewClient(i.BaseUrl)
	userId, err := client.CreateUser(ctx, token.AccessToken, i.Realm, user)
	if err != nil {
		return nil, errors.Wrap(err, "unable to create the user")
	}
	err = client.SetPassword(ctx, token.AccessToken, userId, i.Realm, password, false)
	if err != nil {
		return nil, errors.Wrap(err, "unable to set the password for the user")
	}
	var roleNameLowerCase = strings.ToLower(role)
	roleKeycloak, err := client.GetRealmRole(ctx, token.AccessToken, i.Realm, roleNameLowerCase)
	if err != nil {
		return nil, errors.Wrap(err, fmt.Sprintf("unable to get role by name: '%v'", roleNameLowerCase))
	}
	err = client.AddRealmRoleToUser(ctx, token.AccessToken, i.Realm, userId, []gocloak.Role{
		*roleKeycloak,
	})
	if err != nil {
		return nil, errors.Wrap(err, "unable to add a realm role to user")
	}
	userKeycloak, err := client.GetUserByID(ctx, token.AccessToken, i.Realm, userId)
	if err != nil {
		return nil, errors.Wrap(err, "unable to get recently created user")
	}
	return userKeycloak, nil
}

func (i *Identity) RetrospectToken(ctx context.Context, accessToken string) (*gocloak.IntroSpectTokenResult, error) {
	client := gocloak.NewClient(i.BaseUrl)
	rptResult, err := client.RetrospectToken(ctx, accessToken, i.ClientId, i.ClientSecret, i.Realm)
	if err != nil {
		return nil, errors.Wrap(err, "unable to retrospect token")
	}
	return rptResult, nil
}
