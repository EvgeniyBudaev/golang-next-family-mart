package postgres

import (
	"context"
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/config"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
	"os"
)

type Store struct {
	config *config.Config
	db     *pgxpool.Pool
}

func (s *Store) Db() *pgxpool.Pool {
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
	ctx := context.Background()
	dbpool, err := pgxpool.New(ctx, databaseURL)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	if err := dbpool.Ping(ctx); err != nil {
		logger.Log.Debug("error while Open. error in method Ping", zap.Error(err))
		return err
	}
	s.db = dbpool
	logger.Log.Info("Database connection is successfully!")
	return nil
}

func (s *Store) Close() {
	defer s.db.Close()
}
