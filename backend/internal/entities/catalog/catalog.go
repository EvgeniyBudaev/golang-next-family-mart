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

type ResponseCatalog struct {
	Id            int                            `json:"id"`
	Uuid          uuid.UUID                      `json:"uuid"`
	Alias         string                         `json:"alias"`
	Name          string                         `json:"name"`
	CreatedAt     time.Time                      `json:"createdAt"`
	UpdatedAt     time.Time                      `json:"updatedAt"`
	IsDeleted     bool                           `json:"isDeleted"`
	IsEnabled     bool                           `json:"isEnabled"`
	DefaultImages []*ResponseDefaultImageCatalog `json:"defaultImages"`
	Images        []*ResponseImageCatalog        `json:"images"`
}

type DefaultImageCatalog struct {
	Id        int       `json:"id"`
	CatalogId int       `json:"catalog_id"`
	Uuid      uuid.UUID `json:"uuid"`
	Name      string    `json:"name"`
	Url       string    `json:"url"`
	Size      int64     `json:"size"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	IsDeleted bool      `json:"is_deleted"`
	IsEnabled bool      `json:"is_enabled"`
}

type ResponseDefaultImageCatalog struct {
	Id        int       `json:"id"`
	CatalogId int       `json:"catalogId"`
	Uuid      uuid.UUID `json:"uuid"`
	Name      string    `json:"name"`
	Url       string    `json:"url"`
	Size      int64     `json:"size"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	IsDeleted bool      `json:"isDeleted"`
	IsEnabled bool      `json:"isEnabled"`
}

type ImageCatalog struct {
	Id        int       `json:"id"`
	CatalogId int       `json:"catalog_id"`
	Uuid      uuid.UUID `json:"uuid"`
	Name      string    `json:"name"`
	Url       string    `json:"url"`
	Size      int64     `json:"size"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	IsDeleted bool      `json:"is_deleted"`
	IsEnabled bool      `json:"is_enabled"`
}

type ResponseImageCatalog struct {
	Id        int       `json:"id"`
	CatalogId int       `json:"catalog_id"`
	Uuid      uuid.UUID `json:"uuid"`
	Name      string    `json:"name"`
	Url       string    `json:"url"`
	Size      int64     `json:"size"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	IsDeleted bool      `json:"is_deleted"`
	IsEnabled bool      `json:"is_enabled"`
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
