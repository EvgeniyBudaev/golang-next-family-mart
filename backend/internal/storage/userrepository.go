package storage

import (
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/models"
	"log"
)

type UserRepository struct {
	storage *Storage
}

var (
	tableUser string = "users"
)

func (ur *UserRepository) Create(user *models.User) (*models.User, error) {
	query := fmt.Sprintf("INSERT INTO %s (email, password) VALUES ($1, $2) RETURNING id", tableUser)
	if err := ur.storage.db.QueryRow(query, user.Email, user.Password).Scan(&user.ID); err != nil {
		return nil, err
	}
	return user, nil
}

func (ur *UserRepository) FindById(id int) (*models.User, bool, error) {
	userList, err := ur.SelectAll()
	var founded bool
	if err != nil {
		return nil, founded, err
	}
	var userFound *models.User
	for _, user := range userList {
		if user.ID == id {
			userFound = user
			founded = true
			break
		}
	}
	return userFound, founded, nil
}

func (ur *UserRepository) FindByEmail(email string) (*models.User, bool, error) {
	userList, err := ur.SelectAll()
	var founded bool
	if err != nil {
		return nil, founded, err
	}
	var userFound *models.User
	for _, user := range userList {
		if user.Email == email {
			userFound = user
			founded = true
			break
		}
	}
	return userFound, founded, nil
}

func (ur *UserRepository) SelectAll() ([]*models.User, error) {
	query := fmt.Sprintf("SELECT * FROM %s", tableUser)
	rows, err := ur.storage.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	userList := make([]*models.User, 0)
	for rows.Next() {
		user := models.User{}
		err := rows.Scan(&user.ID, &user.Email, &user.Password)
		if err != nil {
			log.Println(err)
			continue
		}
		userList = append(userList, &user)
	}
	return userList, nil
}
