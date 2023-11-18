package catalog

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/catalog"
	r "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/response"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	catalogUseCase "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/useCase/catalog"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"net/http"
)

type ICreateCatalogUseCase interface {
	CreateCatalog(ctx *fiber.Ctx, request catalogUseCase.CreateCatalogRequest) (*catalog.Catalog, error)
}

type IUpdateCatalogUseCase interface {
	UpdateCatalog(ctx *fiber.Ctx, request catalogUseCase.UpdateCatalogRequest) (*catalog.Catalog, error)
}

type IGetCatalogListUseCase interface {
	GetCatalogList(ctx *fiber.Ctx) (*catalog.ListCatalogResponse, error)
}

type IGetCatalogByAliasUseCase interface {
	GetCatalogByAlias(ctx *fiber.Ctx) (*catalog.Catalog, error)
}

type IGetCatalogByUuidUseCase interface {
	GetCatalogByUuid(ctx *fiber.Ctx) (*catalog.Catalog, error)
}

func PostCatalogCreateHandler(uc ICreateCatalogUseCase) fiber.Handler {
	return func(c *fiber.Ctx) error {
		logger.Log.Info("post to catalog create POST /api/v1/catalog/create")
		var request = catalogUseCase.CreateCatalogRequest{}
		err := c.BodyParser(&request)
		if err != nil {
			logger.Log.Debug("error while PostCatalogCreateHandler. Error in BodyParser", zap.Error(err))
			return r.WrapError(c, err, http.StatusBadRequest)
		}
		response, err := uc.CreateCatalog(c, request)
		if err != nil {
			logger.Log.Debug("error while PostCatalogCreateHandler. Error in CreateCatalog", zap.Error(err))
			return r.WrapError(c, err, http.StatusBadRequest)
		}
		return r.WrapCreated(c, response)
	}
}

func PutCatalogUpdateHandler(uc IUpdateCatalogUseCase) fiber.Handler {
	return func(c *fiber.Ctx) error {
		logger.Log.Info("post to catalog create POST /api/v1/catalog/update")
		var request = catalogUseCase.UpdateCatalogRequest{}
		err := c.BodyParser(&request)
		if err != nil {
			logger.Log.Debug("error while PutCatalogUpdateHandler. Error in BodyParser", zap.Error(err))
			return r.WrapError(c, err, http.StatusBadRequest)
		}
		response, err := uc.UpdateCatalog(c, request)
		if err != nil {
			logger.Log.Debug("error while PutCatalogUpdateHandler. Error in UpdateCatalog", zap.Error(err))
			return r.WrapError(c, err, http.StatusBadRequest)
		}
		return r.WrapCreated(c, response)
	}
}

func GetCatalogByAliasHandler(uc IGetCatalogByAliasUseCase) fiber.Handler {
	return func(c *fiber.Ctx) error {
		logger.Log.Info("get catalog by alias GET /api/v1/catalog/:alias")
		response, err := uc.GetCatalogByAlias(c)
		if err != nil {
			logger.Log.Debug("error while GetCatalogByAliasHandler. Error in GetCatalogByAlias", zap.Error(err))
			return r.WrapError(c, err, http.StatusBadRequest)
		}
		return r.WrapOk(c, response)
	}
}

func GetCatalogByUuidHandler(uc IGetCatalogByUuidUseCase) fiber.Handler {
	return func(c *fiber.Ctx) error {
		logger.Log.Info("get catalog by uuid GET /api/v1/catalog/:uuid")
		response, err := uc.GetCatalogByUuid(c)
		if err != nil {
			logger.Log.Debug("error while GetCatalogByUuidHandler. Error in GetCatalogByUuid", zap.Error(err))
			return r.WrapError(c, err, http.StatusBadRequest)
		}
		return r.WrapOk(c, response)
	}
}

func GetCatalogListHandler(uc IGetCatalogListUseCase) fiber.Handler {
	return func(c *fiber.Ctx) error {
		logger.Log.Info("get catalog list GET /api/v1/catalog/list")
		response, err := uc.GetCatalogList(c)
		if err != nil {
			logger.Log.Debug("error while GetCatalogListHandler. Error in GetCatalogList", zap.Error(err))
			return r.WrapError(c, err, http.StatusBadRequest)
		}
		return r.WrapOk(c, response)
	}
}
