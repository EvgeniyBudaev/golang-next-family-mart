package app

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/api"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/config"
	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
)

func Run() error {
	var cfg config.Config
	if err := godotenv.Load(); err != nil {
		return err
	}
	err := envconfig.Process("MYAPP", &cfg)
	if err != nil {
		return err
	}
	server := api.NewAPI(&cfg)
	return server.Start()
}
