Инициализация зависимостей

```
go mod init github.com/EvgeniyBudaev/golang-next-family-mart/backend
```

Сборка

```
go build -v ./cmd/
```

Удаление неиспользуемых зависимостей

```
go mod tidy -v
```

Библиотека для работы с маршрутами
https://github.com/gorilla/mux

```
go get -u github.com/gorilla/mux
```

Библиотека для работы с переменными окружения ENV
https://github.com/joho/godotenv

```
go get -u github.com/joho/godotenv
```

ENV Config
https://github.com/kelseyhightower/envconfig

```
go get -u github.com/kelseyhightower/envconfig
```

Логирование
https://github.com/sirupsen/logrus

```
go get -u github.com/sirupsen/logrus
```

https://pkg.go.dev/go.uber.org/zap

```
go get -u go.uber.org/zap
```

Подключение к БД
Драйвер для Postgres
https://github.com/jackc/pgx

```
go get -u github.com/jackc/pgx/v5
go get -u github.com/jackc/pgx/v5/pgxpool
```

Миграции
https://github.com/golang-migrate/migrate/blob/master/cmd/migrate/README.md
https://www.appsloveworld.com/go/83/golang-migrate-installation-failing-on-ubuntu-22-04-with-the-following-gpg-error
```
curl -L https://packagecloud.io/golang-migrate/migrate/gpgkey | apt-key add -
sudo sh -c 'echo "deb https://packagecloud.io/golang-migrate/migrate/ubuntu/ $(lsb_release -sc) main" > /etc/apt/sources.list.d/migrate.list'
sudo apt-get update
sudo apt-get install -y golang-migrate
```

Если ошибка E: Указаны конфликтующие значения параметра Signed-By из источника
https://packagecloud.io/golang-migrate/migrate/ubuntu/
jammy: /etc/apt/keyrings/golang-migrate_migrate-archive-keyring.gpg !=
```
cd /etc/apt/sources.list.d
ls
sudo rm migrate.list
```

Создание миграционного репозитория

```
migrate create -ext sql -dir migrations AttributesCreationMigration
migrate create -ext sql -dir migrations SelectablesCreationMigration
migrate create -ext sql -dir migrations CatalogsCreationMigration
migrate create -ext sql -dir migrations CatalogImagesCreationMigration
migrate create -ext sql -dir migrations ProductsCreationMigration
migrate create -ext sql -dir migrations ProductImagesCreationMigration
```

Создание up sql файлов

```
migrate -path migrations -database "postgres://localhost:5432/familymart?sslmode=disable&user=postgres&password=root" up
```

Создание down sql файлов

```
migrate -path migrations -database "postgres://localhost:5432/familymart?sslmode=disable&user=postgres&password=root" down
```

Если ошибка Dirty database version 1. Fix and force version

```
migrate create -ext sql -dir migrations UsersCreationMigration force 20231226053322
```

SQLx
https://github.com/jmoiron/sqlx

```
go get -u github.com/jmoiron/sqlx
```

Fiber
https://github.com/gofiber/fiber

```
go get -u github.com/gofiber/fiber/v2
```

JWT
https://github.com/auth0/go-jwt-middleware
https://github.com/form3tech-oss/jwt-go
https://github.com/golang-jwt/jwt

```
go get -u github.com/auth0/go-jwt-middleware
go get -u github.com/form3tech-oss/jwt-go
go get -u github.com/golang-jwt/jwt/v5
go get -u github.com/gofiber/contrib/jwt
```

CORS
https://github.com/gorilla/handlers

```
go get -u github.com/gorilla/handlers
```

Golang Keycloak API Package
https://github.com/Nerzal/gocloak

```
go get -u github.com/Nerzal/gocloak/v13
```

UUID
https://github.com/google/uuid

```
go get -u github.com/google/uuid
```

Go Util
https://github.com/gookit/goutil

```
go get -u github.com/gookit/goutil
```

Squirrel - fluent SQL generator for Go
https://github.com/Masterminds/squirrel

```
go get -u github.com/Masterminds/squirrel
```
