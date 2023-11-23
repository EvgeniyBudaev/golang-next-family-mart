package error

import "fmt"

type ResponseError struct {
	Message    string `json:"message"`
	Success    bool   `json:"success"`
	StatusCode int    `json:"statusCode"`
}

type CustomError struct {
	StatusCode int `json:"statusCode"`
	Err        error
}

func NewCustomError(err error, httpStatusCode int) error {
	return &CustomError{
		StatusCode: httpStatusCode,
		Err:        err,
	}
}

func (e *CustomError) Error() string {
	return fmt.Sprintf("%s, status code: %d", e.Err, e.StatusCode)
}
