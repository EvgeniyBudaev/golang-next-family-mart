package selectable

type Selectable struct {
	Id          int    `json:"id"`
	AttributeId int    `json:"attribute_id"`
	Value       string `json:"value"`
}

type RequestAttributeSelectable struct {
	Value string `json:"value"`
}

type RequestSelectable struct {
	AttributeId int    `json:"attribute_id"`
	Value       string `json:"value"`
}
