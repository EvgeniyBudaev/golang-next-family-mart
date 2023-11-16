package searching

type Searching struct {
	Search string `json:"search"`
}

func NewSearching(s *Searching) *Searching {
	return &Searching{
		Search: s.Search,
	}
}
