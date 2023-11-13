package product

type Product struct {
	Id           int    `json:"id"`
	Alias        string `json:"alias"`
	CatalogAlias string `json:"catalog_alias"`
	Name         string `json:"name"`
}
