package storage

type Config struct {
	DatabaseURL string `toml:"DATABASE_URL"`
}

func NewConfig() *Config {
	return &Config{}
}
