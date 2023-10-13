package store

import (
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/model"
	"log"
)

const tableUser string = "users"

type UserStore interface {
	Create(user *model.User) (*model.User, error)
	FindById(id int) (*model.User, bool, error)
	FindByEmail(email string) (*model.User, bool, error)
	SelectAll() ([]*model.User, error)
}

type PGUserStore struct {
	store *Store
}

func NewDBUserStore(store *Store) *PGUserStore {
	return &PGUserStore{
		store: store,
	}
}

func (p *PGUserStore) Create(user *model.User) (*model.User, error) {
	query := fmt.Sprintf("INSERT INTO %s (email, password) VALUES ($1, $2) RETURNING id", tableUser)
	if err := p.store.db.QueryRow(query, user.Email, user.Password).Scan(&user.ID); err != nil {
		return nil, err
	}
	return user, nil
}

func (p *PGUserStore) FindById(id int) (*model.User, bool, error) {
	userList, err := p.SelectAll()
	var founded bool
	if err != nil {
		return nil, founded, err
	}
	var userFound *model.User
	for _, user := range userList {
		if user.ID == id {
			userFound = user
			founded = true
			break
		}
	}
	return userFound, founded, nil
}

func (p *PGUserStore) FindByEmail(email string) (*model.User, bool, error) {
	userList, err := p.SelectAll()
	var founded bool
	if err != nil {
		return nil, founded, err
	}
	var userFound *model.User
	for _, user := range userList {
		if user.Email == email {
			userFound = user
			founded = true
			break
		}
	}
	return userFound, founded, nil
}

func (p *PGUserStore) SelectAll() ([]*model.User, error) {
	query := fmt.Sprintf("SELECT * FROM %s", tableUser)
	rows, err := p.store.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	userList := make([]*model.User, 0)
	for rows.Next() {
		user := model.User{}
		err := rows.Scan(&user.ID, &user.Email, &user.Password)
		if err != nil {
			log.Println(err)
			continue
		}
		userList = append(userList, &user)
	}
	return userList, nil
}
