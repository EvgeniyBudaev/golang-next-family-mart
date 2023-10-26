package model

type AuthParams struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthResponse struct {
	AccessToken      string `json:"accessToken"`
	ExpiresIn        string `json:"expiresIn"`
	UserID           int    `json:"userID"`
	RefreshExpiresIn string `json:"refreshExpiresIn"`
	RefreshToken     string `json:"refreshToken"`
	StatusCode       int    `json:"statusCode"`
	TokenType        string `json:"tokenType"`
}
