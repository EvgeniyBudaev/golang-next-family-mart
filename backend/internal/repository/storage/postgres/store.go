package postgres

import (
	"database/sql"
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/config"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	_ "github.com/jackc/pgx/v5/stdlib"
)

type Store struct {
	config *config.Config
	db     *sql.DB
}

func (s *Store) Db() *sql.DB {
	return s.db
}

func NewStore(config *config.Config) *Store {
	return &Store{
		config: config,
	}
}

func (s *Store) Open() error {
	databaseURL := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		s.config.Host, s.config.DBPort, s.config.DBUser, s.config.DBPassword, s.config.DBName,
		s.config.DBSSlMode)
	db, err := sql.Open("pgx", databaseURL)
	if err != nil {
		return err
	}
	if err := db.Ping(); err != nil {
		return err
	}
	s.db = db
	logger.Log.Info("Database connection is successfully!")
	return nil
}

func (s *Store) Close() error {
	err := s.db.Close()
	if err != nil {
		return err
	}
	return nil
}
