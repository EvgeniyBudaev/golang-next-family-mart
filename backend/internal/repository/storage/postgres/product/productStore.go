package product

import (
	"context"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/product"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/logger"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres"
	"go.uber.org/zap"
)

type PGUserStore struct {
	store *postgres.Store
}

func NewDBProductStore(store *postgres.Store) *PGUserStore {
	return &PGUserStore{
		store: store,
	}
}

func (pg *PGUserStore) Create(ctx context.Context, p *product.Product) (*product.Product, error) {
	tx, err := pg.store.Db().Begin()
	if err != nil {
		logger.Log.Debug("error while Create. error in method Begin", zap.Error(err))
		return nil, err
	}
	defer tx.Rollback()
	sqlSelect := "INSERT INTO products (alias, catalog_alias, name) VALUES ($1, $2, $3) RETURNING id"
	stmt, err := tx.PrepareContext(context.TODO(),
		sqlSelect)
	if err != nil {
		logger.Log.Debug("error while Create. error in method PrepareContext", zap.Error(err))
		return nil, err
	}
	defer stmt.Close()
	if err := stmt.QueryRowContext(ctx, p.Alias, p.CatalogAlias, p.Name).Scan(&p.Id); err != nil {
		logger.Log.Debug("error while Create. error in method QueryRowContext", zap.Error(err))
		return nil, err
	}
	tx.Commit()
	return p, nil
}

func (pg *PGUserStore) SelectAll(ctx context.Context) ([]*product.Product, error) {
	sqlSelect := "SELECT * FROM products"
	stmt, err := pg.store.Db().PrepareContext(ctx, sqlSelect)
	if err != nil {
		logger.Log.Debug("error while SelectAll. error in method PrepareContext", zap.Error(err))
		return nil, err
	}
	defer stmt.Close()
	rows, err := stmt.QueryContext(ctx)
	if err != nil {
		logger.Log.Debug("error while SelectAll. error in method QueryContext", zap.Error(err))
		return nil, err
	}
	defer rows.Close()
	productList := make([]*product.Product, 0)
	for rows.Next() {
		product := product.Product{}
		err := rows.Scan(&product.Id, &product.Alias, &product.CatalogAlias, &product.Name)
		if err != nil {
			logger.Log.Debug("error while SelectAll. error in method Scan", zap.Error(err))
			continue
		}
		productList = append(productList, &product)
	}
	return productList, nil
}
