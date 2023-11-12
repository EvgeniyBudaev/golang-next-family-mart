package api

import (
	"encoding/json"
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/useCase/catalog"
	"go.uber.org/zap"
	"net/http"
)

type CatalogHandler struct {
	useCaseCreateCatalog  *catalog.CreateCatalogUseCase
	useCaseGetCatalogList *catalog.GetCatalogListUseCase
}

func NewCatalogHandler(c *catalog.CreateCatalogUseCase, g *catalog.GetCatalogListUseCase) *CatalogHandler {
	return &CatalogHandler{
		useCaseCreateCatalog:  c,
		useCaseGetCatalogList: g,
	}
}

func initCatalogHeaders(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
}

func (c *CatalogHandler) PostCatalogCreateHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	initCatalogHeaders(w)
	logger.Log.Info("post to catalog create POST /api/v1/catalog/create")
	var params catalog.CreateCatalogRequest
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		logger.Log.Debug(
			"error while catalog_handler.PostCatalogCreateHandler. Invalid json received from client",
			zap.Error(err))
		msg := fmt.Errorf("provided json is invalid")
		WrapError(w, msg, http.StatusBadRequest)
		return
	}
	response, err := c.useCaseCreateCatalog.CreateCatalog(ctx, params)
	if err != nil {
		logger.Log.Debug(
			"error while catalog_handler.PostCatalogCreateHandler. Invalid json received from client",
			zap.Error(err))
		msg := fmt.Errorf("created  is invalid")
		WrapError(w, msg, http.StatusBadRequest)
		return
	}
	WrapCreated(w, response)
}

func (c *CatalogHandler) GetCatalogListHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	initCatalogHeaders(w)
	logger.Log.Info("get catalog list GET /api/v1/catalog/all")
	response, err := c.useCaseGetCatalogList.GetCatalogList(ctx)
	if err != nil {
		logger.Log.Debug(
			"error while catalog_handler.GetCatalogListHandler. Invalid json received from client",
			zap.Error(err))
		msg := fmt.Errorf("get list is invalid")
		WrapError(w, msg, http.StatusBadRequest)
		return
	}
	WrapOk(w, response)
}
