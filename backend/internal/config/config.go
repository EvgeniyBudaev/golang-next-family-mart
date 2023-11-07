package config

type Config struct {
	Port         string `envconfig:"PORT"`
	LoggerLevel  string `envconfig:"LOGGER_LEVEL"`
	Host         string `envconfig:"HOST"`
	DBPort       string `envconfig:"DB_PORT"`
	DBUser       string `envconfig:"DB_USER"`
	DBPassword   string `envconfig:"DB_PASSWORD"`
	DBName       string `envconfig:"DB_NAME"`
	DBSSlMode    string `envconfig:"DB_SSLMODE"`
	JWTSecret    string `envconfig:"JWT_SECRET"`
	JWTIssuer    string `envconfig:"JWT_ISSUER"`
	JWTAudience  string `envconfig:"JWT_AUDIENCE"`
	CookieDomain string `envconfig:"COOKIE_DOMAIN"`
	Domain       string `envconfig:"DOMAIN"`
	BaseUrl      string `envconfig:"KEYCLOAK_BASE_URL"`
	Realm        string `envconfig:"KEYCLOAK_REALM"`
	ClientId     string `envconfig:"KEYCLOAK_CLIENT_ID"`
	ClientSecret string `envconfig:"KEYCLOAK_CLIENT_SECRET"`
}
