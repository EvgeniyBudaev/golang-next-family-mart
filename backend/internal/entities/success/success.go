package success

type Success struct {
	Data       any  `json:"data"`
	Success    bool `json:"success"`
	StatusCode int  `json:"statusCode"`
}
