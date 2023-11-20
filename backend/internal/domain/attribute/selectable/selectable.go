package selectable

import "github.com/google/uuid"

type Selectable struct {
	AliasAttribute string    `json:"alias_attribute"`
	Uuid           uuid.UUID `json:"uuid"`
	Value          string    `json:"value"`
}

func NewSelectable(s *Selectable) *Selectable {
	return &Selectable{
		AliasAttribute: s.AliasAttribute,
		Uuid:           s.Uuid,
		Value:          s.Value,
	}
}
