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
	tx, err := pg.store.Db().Begin(ctx)
	if err != nil {
		logger.Log.Debug("error while Create. error in method Begin", zap.Error(err))
		return nil, err
	}
	defer tx.Rollback(ctx)
	sqlSelect := "INSERT INTO products (alias, catalog_alias, name) VALUES ($1, $2, $3) RETURNING id"
	if err := tx.QueryRow(ctx,
		sqlSelect, p.Alias, p.CatalogAlias, p.Name).Scan(&p.Id); err != nil {
		logger.Log.Debug("error while Create. error in method QueryRow", zap.Error(err))
		return nil, err
	}
	tx.Commit(ctx)
	return p, nil
}

func (pg *PGUserStore) SelectAll(ctx context.Context) ([]*product.Product, error) {
	sqlSelect := "SELECT * FROM products"
	productList := make([]*product.Product, 0)
	rows, err := pg.store.Db().Query(ctx, sqlSelect)
	if err != nil {
		logger.Log.Debug("error while SelectAll. error in method Query", zap.Error(err))
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		productData := product.Product{}
		err := rows.Scan(&productData.Id, &productData.Alias, &productData.CatalogAlias, &productData.Name)
		if err != nil {
			logger.Log.Debug("error while SelectAll. error in method Scan", zap.Error(err))
			continue
		}
		productList = append(productList, &productData)
	}
	return productList, nil
}
