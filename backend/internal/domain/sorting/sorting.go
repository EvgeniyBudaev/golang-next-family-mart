package sorting

import (
	sq "github.com/Masterminds/squirrel"
	"strings"
)

type Sorting struct {
	Sort string `json:"sort"`
}

func ApplySorting(sqlBuilder sq.SelectBuilder, sort string, fieldMap map[string]string) sq.SelectBuilder {
	if sort != "" {
		sortFields := make([]string, 0)
		sortParams := strings.Split(sort, ",")
		for _, sortParam := range sortParams {
			fields := strings.Split(sortParam, "_")
			if len(fields) != 2 {
				continue
			}
			field := fields[0]
			mappedField, exists := fieldMap[field]
			if exists {
				field = mappedField
			}
			sortFields = append(sortFields, field+" "+fields[1])
		}
		sqlBuilder = sqlBuilder.OrderBy(sortFields...)
	}
	return sqlBuilder
}
