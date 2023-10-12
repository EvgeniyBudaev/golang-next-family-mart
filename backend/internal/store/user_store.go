package store

import (
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/models"
	"log"
)

const tableUser string = "users"

type UserStore struct {
	store *Store
}

func (us *UserStore) Create(user *models.User) (*models.User, error) {
	query := fmt.Sprintf("INSERT INTO %s (email, password) VALUES ($1, $2) RETURNING id", tableUser)
	if err := us.store.db.QueryRow(query, user.Email, user.Password).Scan(&user.ID); err != nil {
		return nil, err
	}
	return user, nil
}

func (us *UserStore) FindById(id int) (*models.User, bool, error) {
	userList, err := us.SelectAll()
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

func (us *UserStore) FindByEmail(email string) (*models.User, bool, error) {
	userList, err := us.SelectAll()
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

func (us *UserStore) SelectAll() ([]*models.User, error) {
	query := fmt.Sprintf("SELECT * FROM %s", tableUser)
	rows, err := us.store.db.Query(query)
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
