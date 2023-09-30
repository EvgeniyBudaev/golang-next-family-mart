Удаление неиспользуемых зависимостей
go mod tidy -v

Библиотека для работы с маршрутами
go get -u github.com/gorilla/mux

Библиотека для работы с переменными окружения ENV
go get -u github.com/caarlos0/env/v9

Библиотека для работы с переменными окружения TOML
go get -u github.com/BurntSushi/toml

Подключение к БД
Драйвер для Postgres
go get -u github.com/lib/pq

Миграции
https://github.com/golang-migrate/migrate/blob/master/cmd/migrate/README.md
Создание миграционного репозитория
migrate create -ext sql -dir migrations UsersCreationMigration
Создание up sql файлов
migrate -path migrations -database "postgres://localhost:5432/familymart?sslmode=disable&user=postgres&password=root" up
Создание down sql файлов
migrate -path migrations -database "postgres://localhost:5432/familymart?sslmode=disable&user=postgres&
password=root" down
Если ошибка Dirty database version 1. Fix and force version
migrate create -ext sql -dir migrations UsersCreationMigration force 20230930052519