package store

import (
	"database/sql"
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/config"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	_ "github.com/lib/pq"
)

type Store struct {
	config    *config.Config
	db        *sql.DB
	userStore *UserStore
}

func NewStore(config *config.Config) *Store {
	return &Store{
		config: config,
	}
}

func (store *Store) Open() error {
	databaseURL := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		store.config.Host, store.config.DBPort, store.config.DBUser, store.config.DBPassword, store.config.DBName,
		store.config.DBSSlMode)
	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		return err
	}
	if err := db.Ping(); err != nil {
		return err
	}
	store.db = db
	logger.Log.Info("Database connection is successfully!")
	return nil
}

func (store *Store) Close() error {
	err := store.db.Close()
	if err != nil {
		return err
	}
	return nil
}

func (store *Store) UserStore() *UserStore {
	if store.userStore != nil {
		return store.userStore
	}
	store.userStore = &UserStore{
		store: store,
	}
	return store.userStore
}
