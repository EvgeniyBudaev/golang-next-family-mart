package pagination

type Pagination struct {
	Limit int64 `json:"limit"`
	Page  int64 `json:"page"`
}
