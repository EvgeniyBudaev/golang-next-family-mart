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
Создание миграционного репозитория
```
migrate create -ext sql -dir migrations CatalogsCreationMigration
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
migrate create -ext sql -dir migrations UsersCreationMigration force 20230930052519
```

SQLx
https://github.com/jmoiron/sqlx
```
go get -u github.com/jmoiron/sqlx
```

JWT
https://github.com/auth0/go-jwt-middleware
https://github.com/form3tech-oss/jwt-go
https://github.com/golang-jwt/jwt
```
go get -u github.com/auth0/go-jwt-middleware
go get -u github.com/form3tech-oss/jwt-go
go get -u github.com/golang-jwt/jwt/v5
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