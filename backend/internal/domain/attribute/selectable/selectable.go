package selectable

type Selectable struct {
	Id          int    `json:"id"`
	AttributeId int    `json:"attribute_id"`
	Value       string `json:"value"`
}

func NewSelectable(s *Selectable) *Selectable {
	return &Selectable{
		Id:          s.Id,
		AttributeId: s.AttributeId,
		Value:       s.Value,
	}
}

type RequestSelectable struct {
	Value string `json:"value"`
}
