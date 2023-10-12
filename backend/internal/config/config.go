package config

type Config struct {
	Port        string `envconfig:"PORT"`
	LoggerLevel string `envconfig:"LOGGER_LEVEL"`
	Host        string `envconfig:"HOST"`
	DBPort      string `envconfig:"DB_PORT"`
	DBUser      string `envconfig:"DB_USER"`
	DBPassword  string `envconfig:"DB_PASSWORD"`
	DBName      string `envconfig:"DB_NAME"`
	DBSSlMode   string `envconfig:"DB_SSLMODE"`
}
