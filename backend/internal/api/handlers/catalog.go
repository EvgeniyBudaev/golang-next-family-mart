package handlers

import (
	"context"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/catalog"
	r "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/response"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	catalogUseCase "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/useCase/catalog"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type ICreateCatalogUseCase interface {
	CreateCatalog(ctx context.Context, request catalogUseCase.CreateCatalogRequest) (*catalog.Catalog, error)
}

type IGetProductsUseCase interface {
	GetCatalogList(ctx context.Context) ([]*catalog.Catalog, error)
}

type CatalogHandler struct {
	useCaseCreateCatalog  *catalogUseCase.CreateCatalogUseCase
	useCaseGetCatalogList *catalogUseCase.GetCatalogListUseCase
}

func NewCatalogHandler(c *catalogUseCase.CreateCatalogUseCase, g *catalogUseCase.GetCatalogListUseCase) *CatalogHandler {
	return &CatalogHandler{
		useCaseCreateCatalog:  c,
		useCaseGetCatalogList: g,
	}
}

func (c *CatalogHandler) PostCatalogCreateHandler(uc ICreateCatalogUseCase) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var ctx = c.UserContext()
		logger.Log.Info("post to catalog create POST /api/v1/catalog/create")
		var request = catalogUseCase.CreateCatalogRequest{}
		err := c.BodyParser(&request)
		if err != nil {
			logger.Log.Debug("error while PostCatalogCreateHandler. Error in BodyParser", zap.Error(err))
			return r.WrapError(c, err, http.StatusBadRequest)
		}
		response, err := uc.CreateCatalog(ctx, request)
		if err != nil {
			logger.Log.Debug("error while PostCatalogCreateHandler. Error in CreateCatalog", zap.Error(err))
			return r.WrapError(c, err, http.StatusBadRequest)
		}
		return r.WrapCreated(c, response)
	}
}

func (c *CatalogHandler) GetCatalogListHandler(uc IGetProductsUseCase) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var ctx = c.UserContext()
		logger.Log.Info("get catalog list GET /api/v1/catalog/list")
		response, err := uc.GetCatalogList(ctx)
		if err != nil {
			logger.Log.Debug("error while GetCatalogListHandler. Error in GetCatalogList", zap.Error(err))
			return r.WrapError(c, err, http.StatusBadRequest)
		}
		return r.WrapOk(c, response)
	}
}
