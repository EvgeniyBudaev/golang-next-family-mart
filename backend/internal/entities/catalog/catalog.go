package catalog

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/pagination"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/searching"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/sorting"
	"github.com/google/uuid"
	"time"
)

type Catalog struct {
	Id        int       `json:"id"`
	Alias     string    `json:"alias"`
	CreatedAt time.Time `json:"created_at"`
	Deleted   bool      `json:"deleted"`
	Enabled   bool      `json:"enabled"`
	Image     string    `json:"image"`
	Name      string    `json:"name"`
	UpdatedAt time.Time `json:"updated_at"`
	Uuid      uuid.UUID `json:"uuid"`
}

type ListCatalogResponse struct {
	*pagination.Pagination
	Content []*Catalog `json:"content"`
}

type QueryParamsCatalogList struct {
	pagination.Pagination
	searching.Searching
	sorting.Sorting
}

type QueryParamsCatalogByAlias struct {
	Alias string `json:"alias"`
}
