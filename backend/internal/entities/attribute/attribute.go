package attribute

import (
	"github.com/EvgeniyBudaev/golang-next-family-mart/backend/internal/entities/selectable"
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

type RequestAttribute struct {
	Alias      string                                   `json:"alias"`
	CreatedAt  time.Time                                `json:"created_at"`
	Deleted    bool                                     `json:"deleted"`
	Enabled    bool                                     `json:"enabled"`
	Filtered   bool                                     `json:"filtered"`
	Name       string                                   `json:"name"`
	Type       string                                   `json:"type"`
	UpdatedAt  time.Time                                `json:"updated_at"`
	Uuid       uuid.UUID                                `json:"uuid"`
	Selectable []*selectable.RequestAttributeSelectable `json:"selectable"`
}
