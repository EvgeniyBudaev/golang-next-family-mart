package main

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/app"
	"log"
)

func main() {
	err := app.Run()
	if err != nil {
		log.Fatal(err)
	}
}
