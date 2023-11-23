package attribute

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/attribute"
	errorDomain "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/error"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres"
	sq "github.com/Masterminds/squirrel"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"net/http"
)

type PGAttributeStore struct {
	store *postgres.Store
}

func NewDBAttributeStore(store *postgres.Store) *PGAttributeStore {
	return &PGAttributeStore{
		store: store,
	}
}

func (pg *PGAttributeStore) Create(cf *fiber.Ctx, a *attribute.RequestAttribute) (*attribute.Attribute, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	ctx := cf.Context()
	tx, err := pg.store.Db().Begin(ctx)
	if err != nil {
		logger.Log.Debug("error while Create. error in method Begin", zap.Error(err))
		return nil, err
	}
	defer tx.Rollback(ctx)
	data := attribute.Attribute{
		Alias:     a.Alias,
		CreatedAt: a.CreatedAt,
		Deleted:   a.Deleted,
		Enabled:   a.Enabled,
		Filtered:  a.Filtered,
		Name:      a.Name,
		Type:      a.Type,
		UpdatedAt: a.UpdatedAt,
		Uuid:      a.Uuid,
	}
	sqlSelect := sqlBuilder.Insert("attributes").
		Columns("alias", "created_at", "deleted", "enabled", "filtered", "name", "type", "updated_at", "uuid").
		Values(&data.Alias, &data.CreatedAt, &data.Deleted, &data.Enabled, &data.Filtered, &data.Name, &data.Type,
			&data.UpdatedAt, &data.Uuid).
		Suffix("RETURNING id")
	query, args, err := sqlSelect.ToSql()
	if err != nil {
		return nil, err
	}
	err = tx.QueryRow(ctx, query, args...).Scan(&data.Id)
	if err != nil {
		logger.Log.Debug("error while Create. error in method QueryRow", zap.Error(err))
		msg := errors.Wrap(err, "bad request")
		err = errorDomain.NewCustomError(msg, http.StatusBadRequest)
		return nil, err
	}
	tx.Commit(ctx)
	return &data, nil
}
