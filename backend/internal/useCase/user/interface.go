package user

import (
	"context"
	"github.com/Nerzal/gocloak/v13"
)

type IIdentity interface {
	CreateUser(ctx context.Context, user gocloak.User, password string, role string) (*gocloak.User, error)
}
