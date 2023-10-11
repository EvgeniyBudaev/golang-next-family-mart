package config

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/storage"
)

type Config struct {
	Port        string `toml:"APP_PORT"`
	LoggerLevel string `toml:"LOGGER_LEVEL"`
	Storage     *storage.Config
}

func NewConfig() *Config {
	return &Config{
		Port:        ":8080",
		LoggerLevel: "DEBUG",
		Storage:     storage.NewConfig(),
	}
}
