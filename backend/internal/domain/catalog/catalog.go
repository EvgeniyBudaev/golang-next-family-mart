package catalog

import (
	"github.com/google/uuid"
	"time"
)

type Catalog struct {
	Id        int       `json:"id"`
	Alias     string    `json:"alias"`
	CreatedAt time.Time `json:"created_at"`
	Name      string    `json:"name"`
	Uuid      uuid.UUID `json:"uuid"`
}
