package attribute

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/pagination"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/searching"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/sorting"
	"github.com/google/uuid"
	"time"
)

type Attribute struct {
	Id        int       `json:"id"`
	Alias     string    `json:"alias"`
	CreatedAt time.Time `json:"created_at"`
	Deleted   bool      `json:"deleted"`
	Enabled   bool      `json:"enabled"`
	Filtered  bool      `json:"filtered"`
	Name      string    `json:"name"`
	Type      string    `json:"type"`
	UpdatedAt time.Time `json:"updated_at"`
	Uuid      uuid.UUID `json:"uuid"`
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
