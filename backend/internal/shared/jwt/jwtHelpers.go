package jwt

import (
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/golang-jwt/jwt/v5"
	"github.com/gookit/goutil"
	"go.uber.org/zap"
	"strings"
)

type JwtHelper struct {
	claims       jwt.MapClaims
	realmRoles   []string
	accountRoles []string
	scopes       []string
}

func NewJwtHelper(claims jwt.MapClaims) *JwtHelper {

	return &JwtHelper{
		claims:       claims,
		realmRoles:   parseRealmRoles(claims),
		accountRoles: parseAccountRoles(claims),
		scopes:       parseScopes(claims),
	}
}

func (j *JwtHelper) GetUserId() (string, error) {
	return j.claims.GetSubject()
}

func (j *JwtHelper) IsUserInRealmRole(role string) bool {
	return goutil.Contains(j.realmRoles, role)
}

func (j *JwtHelper) TokenHasScope(scope string) bool {
	return goutil.Contains(j.scopes, scope)
}

func parseRealmRoles(claims jwt.MapClaims) []string {
	var realmRoles []string = make([]string, 0)
	if claim, ok := claims["realm_access"]; ok {
		if roles, ok := claim.(map[string]interface{})["roles"]; ok {
			for _, role := range roles.([]interface{}) {
				realmRoles = append(realmRoles, role.(string))
			}
		}
	}
	return realmRoles
}

func parseAccountRoles(claims jwt.MapClaims) []string {
	var accountRoles []string = make([]string, 0)
	if claim, ok := claims["resource_access"]; ok {
		if acc, ok := claim.(map[string]interface{})["account"]; ok {
			if roles, ok := acc.(map[string]interface{})["roles"]; ok {
				for _, role := range roles.([]interface{}) {
					accountRoles = append(accountRoles, role.(string))
				}
			}
		}
	}
	return accountRoles
}

func parseScopes(claims jwt.MapClaims) []string {
	scopeStr, err := parseString(claims, "scope")
	if err != nil {
		logger.Log.Debug("error while parseScopes. Error in parseString", zap.Error(err))
		return make([]string, 0)
	}
	scopes := strings.Split(scopeStr, " ")
	return scopes
}

func parseString(claims jwt.MapClaims, key string) (string, error) {
	var (
		ok  bool
		raw interface{}
		iss string
	)
	raw, ok = claims[key]
	if !ok {
		logger.Log.Debug("error while parseString. Error in claims")
		return "", nil
	}
	iss, ok = raw.(string)
	if !ok {
		err := fmt.Errorf("key %s is invalid", key)
		logger.Log.Debug("error while parseString. Error in raw", zap.Error(err))
		return "", err
	}
	return iss, nil
}
