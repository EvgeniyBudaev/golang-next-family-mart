package attribute

import (
	"github.com/google/uuid"
	"time"
)

type Attribute struct {
	Id         int           `json:"id"`
	Alias      string        `json:"alias"`
	CreatedAt  time.Time     `json:"created_at"`
	Deleted    bool          `json:"deleted"`
	Enabled    bool          `json:"enabled"`
	Filtered   bool          `json:"filtered"`
	Name       string        `json:"name"`
	Selectable *[]Selectable `json:"selectable"`
	Type       string        `json:"type"`
	UpdatedAt  time.Time     `json:"updated_at"`
	Uuid       uuid.UUID     `json:"uuid"`
}
