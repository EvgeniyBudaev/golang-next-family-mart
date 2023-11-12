package middlewares

import (
	"context"
	"github.com/Nerzal/gocloak/v13"
)

type TokenRetrospector interface {
	RetrospectToken(ctx context.Context, accessToken string) (*gocloak.IntroSpectTokenResult, error)
}
