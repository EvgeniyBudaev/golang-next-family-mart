package product

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/pagination"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/searching"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/sorting"
	"github.com/google/uuid"
	"time"
)

type Product struct {
	Id        int             `json:"id"`
	CatalogId int             `json:"catalogId"`
	Uuid      uuid.UUID       `json:"uuid"`
	Alias     string          `json:"alias"`
	Name      string          `json:"name"`
	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
	IsDeleted bool            `json:"isDeleted"`
	IsEnabled bool            `json:"isEnabled"`
	Images    []*ImageProduct `json:"images"`
}

type ImageProduct struct {
	Id        int       `json:"id"`
	ProductId int       `json:"productId"`
	Uuid      uuid.UUID `json:"uuid"`
	Name      string    `json:"name"`
	Url       string    `json:"url"`
	Size      int64     `json:"size"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	IsDeleted bool      `json:"isDeleted"`
	IsEnabled bool      `json:"isEnabled"`
}

type ListProductResponse struct {
	*pagination.Pagination
	Content []*Product `json:"content"`
}

type QueryParamsProductList struct {
	pagination.Pagination
	searching.Searching
	sorting.Sorting
}

type QueryParamsProductByAlias struct {
	Alias string `json:"alias"`
}
