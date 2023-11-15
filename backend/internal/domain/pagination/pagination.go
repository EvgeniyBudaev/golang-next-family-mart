package pagination

type Pagination struct {
	HasNext     bool  `json:"hasNext"`
	HasPrevious bool  `json:"hasPrevious"`
	Limit       int64 `json:"limit"`
	Page        int64 `json:"page"`
	TotalItems  int64 `json:"totalItems"`
}

func NewPagination(pag *Pagination) *Pagination {
	return &Pagination{
		HasNext:     pag.HasNext,
		HasPrevious: pag.HasPrevious,
		Limit:       pag.Limit,
		Page:        pag.Page,
		TotalItems:  pag.TotalItems,
	}
}
