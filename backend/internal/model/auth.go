package model

import "time"

type Auth struct {
	Issuer        string
	Audience      string
	Secret        string
	TokenExpiry   time.Duration
	RefreshExpiry time.Duration
	CookieDomain  string
	CookiePath    string
	CookieName    string
	UserID        int
}

type AuthParams struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthResponse struct {
	AccessToken      string `json:"accessToken"`
	ExpiresIn        string `json:"expiresIn"`
	RefreshExpiresIn string `json:"refreshExpiresIn"`
	RefreshToken     string `json:"refreshToken"`
	StatusCode       int    `json:"statusCode"`
	Success          bool   `json:"success"`
	TokenType        string `json:"tokenType"`
	UserID           int    `json:"userID"`
}
