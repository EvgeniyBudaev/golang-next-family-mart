package main

import (
	"flag"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/app"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/config"
	"log"
)

var (
	configPath string
)

func init() {
	flag.StringVar(&configPath, "path", "configs/api.toml", "path to config file in .toml format")
}

func main() {
	flag.Parse()
	initConfig := config.NewConfig()
	log.Fatal(app.Run(initConfig, configPath))
}
