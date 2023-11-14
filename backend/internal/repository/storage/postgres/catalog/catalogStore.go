package catalog

import (
	"context"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/catalog"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres"
	"go.uber.org/zap"
)

type PGUserStore struct {
	store *postgres.Store
}

func NewDBCatalogStore(store *postgres.Store) *PGUserStore {
	return &PGUserStore{
		store: store,
	}
}

func (pg *PGUserStore) Create(ctx context.Context, c *catalog.Catalog) (*catalog.Catalog, error) {
	tx, err := pg.store.Db().Begin(ctx)
	if err != nil {
		logger.Log.Debug("error while Create. error in method Begin", zap.Error(err))
		return nil, err
	}
	defer tx.Rollback(ctx)
	sqlSelect := "INSERT INTO catalogs (alias, created_at, name, uuid) VALUES ($1, $2, $3, $4) RETURNING id"
	if err := tx.QueryRow(ctx,
		sqlSelect, c.Alias, c.CreatedAt, c.Name, c.Uuid).Scan(&c.Id); err != nil {
		logger.Log.Debug("error while Create. error in method QueryRow", zap.Error(err))
		return nil, err
	}
	tx.Commit(ctx)
	return c, nil
}

func (pg *PGUserStore) SelectAll(ctx context.Context) ([]*catalog.Catalog, error) {
	sqlSelect := "SELECT * FROM catalogs ORDER BY created_at DESC, id DESC"
	catalogList := make([]*catalog.Catalog, 0)
	rows, err := pg.store.Db().Query(ctx, sqlSelect)
	if err != nil {
		logger.Log.Debug("error while SelectAll. error in method Query", zap.Error(err))
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		catalogData := catalog.Catalog{}
		err := rows.Scan(&catalogData.Id, &catalogData.Alias, &catalogData.CreatedAt, &catalogData.Name, &catalogData.Uuid)
		if err != nil {
			logger.Log.Debug("error while SelectAll. error in method Scan", zap.Error(err))
			continue
		}
		catalogList = append(catalogList, &catalogData)
	}
	return catalogList, nil
}
