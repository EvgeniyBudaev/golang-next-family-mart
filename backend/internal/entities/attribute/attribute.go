package attribute

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/pagination"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/searching"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/sorting"
	"github.com/google/uuid"
	"time"
)

type Attribute struct {
	Id         int       `json:"id"`
	CatalogId  int       `json:"catalogId"`
	Uuid       uuid.UUID `json:"uuid"`
	Alias      string    `json:"alias"`
	Name       string    `json:"name"`
	Type       string    `json:"type"`
	CreatedAt  time.Time `json:"createdAt"`
	UpdatedAt  time.Time `json:"updatedAt"`
	IsDeleted  bool      `json:"isDeleted"`
	IsEnabled  bool      `json:"isEnabled"`
	IsFiltered bool      `json:"isFiltered"`
}

type ListAttributeResponse struct {
	*pagination.Pagination
	Content []*Attribute `json:"content"`
}

type QueryParamsAttributeList struct {
	pagination.Pagination
	searching.Searching
	sorting.Sorting
}
