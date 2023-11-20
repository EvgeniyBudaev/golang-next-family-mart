package attribute

import (
	"fmt"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/attribute"
	errorDomain "github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/error"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres"
	sq "github.com/Masterminds/squirrel"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"net/http"
	"strings"
)

type PGAttributeStore struct {
	store *postgres.Store
}

func NewDBAttributeStore(store *postgres.Store) *PGAttributeStore {
	return &PGAttributeStore{
		store: store,
	}
}

func (pg *PGAttributeStore) Create(cf *fiber.Ctx, a *attribute.Attribute) (*attribute.Attribute, error) {
	sqlBuilder := sq.StatementBuilder.PlaceholderFormat(sq.Dollar)
	ctx := cf.Context()
	tx, err := pg.store.Db().Begin(ctx)
	if err != nil {
		logger.Log.Debug("error while Create. error in method Begin", zap.Error(err))
		return nil, err
	}
	defer tx.Rollback(ctx)

	var selectableQueries []string
	for _, s := range a.Selectable {
		subQuery := sqlBuilder.Insert("selectables").
			Columns("value").
			Values(a.Id, s.Value).
			Suffix("RETURNING id, attribute_id")
		query, _, err := subQuery.ToSql()
		if err != nil {
			logger.Log.Debug("error while Create. Error building subQuery.ToSql", zap.Error(err))
			return nil, err
		}
		selectableQueries = append(selectableQueries, query)
	}

	sqlSelect := sqlBuilder.Insert("attributes").
		Columns("alias", "created_at", "deleted", "enabled", "filtered", "name", "type", "updated_at", "uuid",
			"selectable").
		Values(a.Alias, a.CreatedAt, a.Deleted, a.Enabled, a.Filtered, a.Name, a.Type, a.UpdatedAt, a.Uuid,
			sq.Expr(strings.Join(selectableQueries, ","))).
		Suffix("RETURNING id")

	query, args, err := sqlSelect.ToSql()
	if err != nil {
		return nil, err
	}
	fmt.Println("SQL Query:", query)
	fmt.Println("Arguments:", args)
	err = tx.QueryRow(ctx, query, args...).Scan(&a.Id)
	if err != nil {
		logger.Log.Debug("error while Create. error in method QueryRow", zap.Error(err))
		msg := errors.Wrap(err, "bad request")
		err = errorDomain.NewCustomError(msg, http.StatusBadRequest)
		return nil, err
	}
	tx.Commit(ctx)
	return a, nil
}
