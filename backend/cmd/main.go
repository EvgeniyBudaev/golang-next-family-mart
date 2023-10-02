package main

import (
	"flag"
	"github.com/BurntSushi/toml"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/app/api"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/app/logger"
	"go.uber.org/zap"
	"log"
)

var (
	configPath string
)

func init() {
	flag.StringVar(&configPath, "path", "configs/api.toml", "path to config file in .toml format")
}

func main() {
	log.Fatal(run())
}

func run() error {
	flag.Parse()
	config := api.NewConfig()
	log.Println("Before config: ", *config)
	_, err := toml.DecodeFile(configPath, config) //err := env.Parse(config) через ENV окружение
	if err != nil {
		logger.Log.Info("main.go run(). Can't find configs file. Using default values", zap.Error(err))
	}
	log.Println("After config: ", *config)
	server := api.New(config)

	return server.Start()
}
