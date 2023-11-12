package catalog

import (
	"context"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/catalog"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres"
	"go.uber.org/zap"
	"log"
)

type PGUserStore struct {
	store *postgres.Store
}

func NewDBCatalogStore(store *postgres.Store) *PGUserStore {
	return &PGUserStore{
		store: store,
	}
}

func (p *PGUserStore) Create(ctx context.Context, c *catalog.Catalog) (*catalog.Catalog, error) {
	tx, err := p.store.Db().Begin()
	if err != nil {
		logger.Log.Debug(
			"error while catalogStore.Create. error in method Begin",
			zap.Error(err))
		return nil, err
	}
	defer tx.Rollback()
	sqlSelect := "INSERT INTO catalogs (name) VALUES ($1) RETURNING id"
	stmt, err := tx.PrepareContext(context.TODO(),
		sqlSelect)
	if err != nil {
		logger.Log.Debug(
			"error while catalogStore.Create. error in method PrepareContext",
			zap.Error(err))
		return nil, err
	}
	defer stmt.Close()
	if err := stmt.QueryRowContext(ctx, c.Name).Scan(&c.Id); err != nil {
		logger.Log.Debug(
			"error while catalogStore.Create. error in method QueryRowContext",
			zap.Error(err))
		return nil, err
	}
	tx.Commit()
	return c, nil
}

func (p *PGUserStore) SelectAll(ctx context.Context) ([]*catalog.Catalog, error) {
	sqlSelect := "SELECT * FROM catalogs"
	stmt, err := p.store.Db().PrepareContext(ctx, sqlSelect)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()
	rows, err := stmt.QueryContext(ctx)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	catalogList := make([]*catalog.Catalog, 0)
	for rows.Next() {
		catalog := catalog.Catalog{}
		err := rows.Scan(&catalog.Id, &catalog.Name)
		if err != nil {
			log.Println(err)
			continue
		}
		catalogList = append(catalogList, &catalog)
	}
	return catalogList, nil
}
