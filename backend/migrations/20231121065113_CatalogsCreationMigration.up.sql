CREATE TABLE catalogs (
                          id BIGSERIAL NOT NULL PRIMARY KEY,
                          uuid uuid NOT NULL UNIQUE,
                          alias VARCHAR NOT NULL UNIQUE,
                          name VARCHAR NOT NULL UNIQUE,
                          created_at TIMESTAMP NOT NULL,
                          updated_at TIMESTAMP NOT NULL,
                          is_deleted bool NOT NULL,
                          is_enabled bool NOT NULL
);
