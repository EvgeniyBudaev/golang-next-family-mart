package model

type User struct {
	ID                int    `json:"id"`
	Email             string `json:"email"`
	EncryptedPassword string `json:"-"`
}

type CreateUserParams struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
