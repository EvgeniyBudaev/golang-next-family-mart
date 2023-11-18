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

type IDeleteCatalogUseCase interface {
	DeleteCatalog(ctx *fiber.Ctx) (*catalog.Catalog, error)
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

func CreateCatalogHandler(uc ICreateCatalogUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("post to catalog create POST /api/v1/catalog/create")
		var request = catalogUseCase.CreateCatalogRequest{}
		err := ctx.BodyParser(&request)
		if err != nil {
			logger.Log.Debug("error while CreateCatalogHandler. Error in BodyParser", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		response, err := uc.CreateCatalog(ctx, request)
		if err != nil {
			logger.Log.Debug("error while CreateCatalogHandler. Error in CreateCatalog", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapCreated(ctx, response)
	}
}

func DeleteCatalogHandler(uc IDeleteCatalogUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("post to catalog create DELETE /api/v1/catalog/delete/:uuid")
		response, err := uc.DeleteCatalog(ctx)
		if err != nil {
			logger.Log.Debug("error while DeleteCatalogHandler(. Error in Delete", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapOk(ctx, response)
	}
}

func UpdateCatalogHandler(uc IUpdateCatalogUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("post to catalog create POST /api/v1/catalog/update")
		var request = catalogUseCase.UpdateCatalogRequest{}
		err := ctx.BodyParser(&request)
		if err != nil {
			logger.Log.Debug("error while UpdateCatalogHandler. Error in BodyParser", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		response, err := uc.UpdateCatalog(ctx, request)
		if err != nil {
			logger.Log.Debug("error while UpdateCatalogHandler. Error in UpdateCatalog", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapCreated(ctx, response)
	}
}

func GetCatalogByAliasHandler(uc IGetCatalogByAliasUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("get catalog by alias GET /api/v1/catalog/:alias")
		response, err := uc.GetCatalogByAlias(ctx)
		if err != nil {
			logger.Log.Debug("error while GetCatalogByAliasHandler. Error in GetCatalogByAlias", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapOk(ctx, response)
	}
}

func GetCatalogByUuidHandler(uc IGetCatalogByUuidUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("get catalog by uuid GET /api/v1/catalog/:uuid")
		response, err := uc.GetCatalogByUuid(ctx)
		if err != nil {
			logger.Log.Debug("error while GetCatalogByUuidHandler. Error in GetCatalogByUuid", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapOk(ctx, response)
	}
}

func GetCatalogListHandler(uc IGetCatalogListUseCase) fiber.Handler {
	return func(ctx *fiber.Ctx) error {
		logger.Log.Info("get catalog list GET /api/v1/catalog/list")
		response, err := uc.GetCatalogList(ctx)
		if err != nil {
			logger.Log.Debug("error while GetCatalogListHandler. Error in GetCatalogList", zap.Error(err))
			return r.WrapError(ctx, err, http.StatusBadRequest)
		}
		return r.WrapOk(ctx, response)
	}
}
