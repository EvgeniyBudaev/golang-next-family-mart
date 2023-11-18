package error

import "fmt"

type CustomError struct {
	Message    string `json:"message"`
	Success    bool   `json:"success"`
	StatusCode int    `json:"statusCode"`
}

type ResponseError struct {
	StatusCode int `json:"statusCode"`
	Err        error
}

func NewResponseError(err error, httpStatusCode int) error {
	return &ResponseError{
		StatusCode: httpStatusCode,
		Err:        err,
	}
}

func (e *ResponseError) Error() string {
	return fmt.Sprintf("%s, status code: %d", e.Err, e.StatusCode)
}
