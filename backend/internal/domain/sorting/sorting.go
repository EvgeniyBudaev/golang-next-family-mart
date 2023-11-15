package sorting

type Sorting struct {
	Sort string `json:"sort"`
}

func NewSorting(s *Sorting) *Sorting {
	return &Sorting{
		Sort: s.Sort,
	}
}
