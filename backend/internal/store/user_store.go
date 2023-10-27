package store

import (
	"context"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/model"
	"log"
)

type UserStore interface {
	Create(ctx context.Context, user *model.User) (*model.User, error)
	FindById(ctx context.Context, id int) (*model.User, bool, error)
	FindByEmail(ctx context.Context, email string) (*model.User, bool, error)
	SelectAll(ctx context.Context) ([]*model.User, error)
}

type PGUserStore struct {
	store *Store
}

func NewDBUserStore(store *Store) *PGUserStore {
	return &PGUserStore{
		store: store,
	}
}

func (p *PGUserStore) Create(ctx context.Context, user *model.User) (*model.User, error) {
	tx, err := p.store.db.Begin()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()
	sqlSelect := "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id"
	stmt, err := tx.PrepareContext(context.TODO(),
		sqlSelect)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()
	if err := stmt.QueryRowContext(ctx, user.Email, user.EncryptedPassword).Scan(&user.ID); err != nil {
		return nil, err
	}
	tx.Commit()
	return user, nil
}

func (p *PGUserStore) FindById(ctx context.Context, id int) (*model.User, bool, error) {
	var founded bool
	var userFound *model.User
	userList, err := p.SelectAll(ctx)
	if err != nil {
		return nil, founded, err
	}
	for _, user := range userList {
		if user.ID == id {
			userFound = user
			founded = true
			break
		}
	}
	return userFound, founded, nil
}

func (p *PGUserStore) FindByEmail(ctx context.Context, email string) (*model.User, bool, error) {
	userList, err := p.SelectAll(ctx)
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

func (p *PGUserStore) SelectAll(ctx context.Context) ([]*model.User, error) {
	sqlSelect := "SELECT * FROM users"
	stmt, err := p.store.db.PrepareContext(ctx, sqlSelect)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()
	rows, err := stmt.QueryContext(ctx)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	userList := make([]*model.User, 0)
	for rows.Next() {
		user := model.User{}
		err := rows.Scan(&user.ID, &user.Email, &user.EncryptedPassword)
		if err != nil {
			log.Println(err)
			continue
		}
		userList = append(userList, &user)
	}
	return userList, nil
}
