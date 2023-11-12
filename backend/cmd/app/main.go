package main

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/app"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"go.uber.org/zap"
	"log"
)

func main() {
	err := app.Run()
	if err != nil {
		logger.Log.Debug("error while main. Error in Run", zap.Error(err))
		log.Fatal(err)
	}
}
