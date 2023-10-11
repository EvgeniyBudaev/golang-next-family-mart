package storage

import (
	"database/sql"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	_ "github.com/lib/pq"
)

type Storage struct {
	config         *Config
	db             *sql.DB
	userRepository *UserRepository
}

func New(config *Config) *Storage {
	return &Storage{
		config: config,
	}
}

func (storage *Storage) Open() error {
	db, err := sql.Open("postgres", storage.config.DatabaseURL)
	if err != nil {
		return err
	}
	if err := db.Ping(); err != nil {
		return err
	}
	storage.db = db
	logger.Log.Info("Database connection is successfully!")
	return nil
}

func (storage *Storage) Close() error {
	err := storage.db.Close()
	if err != nil {
		return err
	}
	return nil
}

func (storage *Storage) User() *UserRepository {
	if storage.userRepository != nil {
		return storage.userRepository
	}
	storage.userRepository = &UserRepository{
		storage: storage,
	}
	return storage.userRepository
}
