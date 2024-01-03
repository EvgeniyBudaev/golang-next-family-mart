package selectable

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/pagination"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/searching"
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/sorting"
	"github.com/google/uuid"
	"time"
)

type Selectable struct {
	Id          int       `json:"id"`
	AttributeId int       `json:"attributeId"`
	Uuid        uuid.UUID `json:"uuid"`
	Value       string    `json:"value"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
	IsDeleted   bool      `json:"isDeleted"`
	IsEnabled   bool      `json:"isEnabled"`
}

type RequestAttributeSelectable struct {
	Value string `json:"value"`
}

type RequestSelectable struct {
	AttributeId int    `json:"attributeId"`
	Value       string `json:"value"`
}

type ListSelectableResponse struct {
	*pagination.Pagination
	Content []*Selectable `json:"content"`
}

type QueryParamsSelectableList struct {
	pagination.Pagination
	searching.Searching
	sorting.Sorting
}
