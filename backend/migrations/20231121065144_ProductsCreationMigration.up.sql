CREATE TABLE products (
                          id BIGSERIAL NOT NULL PRIMARY KEY,
                          alias VARCHAR NOT NULL UNIQUE,
                          created_at TIMESTAMP NOT NULL,
                          deleted bool NOT NULL,
                          enabled bool NOT NULL,
                          image VARCHAR,
                          name VARCHAR NOT NULL UNIQUE,
                          updated_at TIMESTAMP NOT NULL,
                          uuid uuid NOT NULL UNIQUE
);

ALTER TABLE products
    ADD COLUMN catalog_id BIGINT,
    ADD FOREIGN KEY (catalog_id) REFERENCES catalogs(id);