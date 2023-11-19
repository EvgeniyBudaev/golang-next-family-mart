package attribute

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/domain/attribute"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/repository/storage/postgres"
	"github.com/gofiber/fiber/v2"
)

type PGSelectableStore struct {
	store *postgres.Store
}

func NewDBSelectableStore(store *postgres.Store) *PGSelectableStore {
	return &PGSelectableStore{
		store: store,
	}
}

func (pg *PGSelectableStore) Create(cf *fiber.Ctx, a *attribute.Selectable) (*attribute.Selectable, error) {
	return nil, nil
}
