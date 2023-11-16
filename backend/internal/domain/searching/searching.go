package searching

import (
	"fmt"
	sq "github.com/Masterminds/squirrel"
	"strings"
)

type Searching struct {
	Search string `json:"search"`
}

func NewSearching(s *Searching) *Searching {
	return &Searching{
		Search: s.Search,
	}
}

func ApplySearch(sqlBuilder sq.SelectBuilder, searchKey, searchString string) sq.SelectBuilder {
	if searchString != "" {
		str := strings.ToLower(strings.TrimSpace(searchString))
		sqlBuilder = sqlBuilder.Where(sq.Like{fmt.Sprintf("LOWER(%s)", searchKey): "%" + str + "%"})
	}
	return sqlBuilder
}
