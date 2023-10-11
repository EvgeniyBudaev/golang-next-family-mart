package app

import (
	"github.com/BurntSushi/toml"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/api"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/config"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"go.uber.org/zap"
	"log"
)

func Run(cfg *config.Config, configPath string) error {
	log.Println("Before config: ", *cfg)
	_, err := toml.DecodeFile(configPath, cfg) //err := env.Parse(config) через ENV окружение
	if err != nil {
		logger.Log.Info("main.go run(). Can't find configs file. Using default values", zap.Error(err))
	}
	log.Println("After config: ", *cfg)
	server := api.New(cfg)

	return server.Start()
}
