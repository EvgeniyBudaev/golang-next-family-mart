package main

import (
	"flag"
	"github.com/BurntSushi/toml"
	"github.com/EvgeniyBudaev/golang-next-family-mart/internal/app/api"
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
	log.Println("Start app")
	config := api.NewConfig()
	log.Println("Before config", *config)
	_, err := toml.DecodeFile(configPath, config) //err := env.Parse(config) через ENV окружение
	if err != nil {
		log.Println("Can't find configs file. Using default values", err)
	}

	server := api.New(config)
	log.Println("After config", *config)

	return server.Start()
}
