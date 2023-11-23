package selectable

type Selectable struct {
	Id          int    `json:"id"`
	AttributeId int    `json:"attribute_id"`
	Value       string `json:"value"`
}

type RequestSelectable struct {
	Value string `json:"value"`
}
