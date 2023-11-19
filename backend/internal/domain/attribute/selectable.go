package attribute

import "github.com/google/uuid"

type Selectable struct {
	Id             int       `json:"id"`
	IdAttribute    int       `json:"id_attribute"`
	AliasAttribute string    `json:"alias_attribute"`
	Uuid           uuid.UUID `json:"uuid"`
	Value          string    `json:"value"`
}
