package catalog

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/pagination"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/searching"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/sorting"
	"github.com/google/uuid"
	"time"
)

type Catalog struct {
	Id            int                    `json:"id"`
	Uuid          uuid.UUID              `json:"uuid"`
	Alias         string                 `json:"alias"`
	Name          string                 `json:"name"`
	CreatedAt     time.Time              `json:"created_at"`
	UpdatedAt     time.Time              `json:"updated_at"`
	IsDeleted     bool                   `json:"is_deleted"`
	IsEnabled     bool                   `json:"is_enabled"`
	DefaultImages []*DefaultImageCatalog `json:"default_images"`
	Images        []*ImageCatalog        `json:"images"`
}

type DefaultImageCatalog struct {
	Id        int    `json:"id"`
	CatalogId int    `json:"catalog_id"`
	Url       string `json:"url"`
}

type ImageCatalog struct {
	Id        int    `json:"id"`
	CatalogId int    `json:"catalog_id"`
	Url       string `json:"url"`
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
