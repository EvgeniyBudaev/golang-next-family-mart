package api

import "github.com/EvgeniyBudaev/golang-next-family-mart/storage"

type Config struct {
	Port    string `toml:"APP_PORT"`
	Storage *storage.Config
}

func NewConfig() *Config {
	return &Config{
		Port:    ":8080",
		Storage: storage.NewConfig(),
	}
}
