package product

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/pagination"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/searching"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/sorting"
	"github.com/google/uuid"
	"time"
)

type Product struct {
	Id        int       `json:"id"`
	Alias     string    `json:"alias"`
	CatalogId int       `json:"catalog_id"`
	CreatedAt time.Time `json:"created_at"`
	Deleted   bool      `json:"deleted"`
	Enabled   bool      `json:"enabled"`
	Image     string    `json:"image"`
	Name      string    `json:"name"`
	UpdatedAt time.Time `json:"updated_at"`
	Uuid      uuid.UUID `json:"uuid"`
}

type ListProductResponse struct {
	*pagination.Pagination
	Content []*Product
}

type QueryParamsProductList struct {
	pagination.Pagination
	searching.Searching
	sorting.Sorting
}
