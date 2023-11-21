CREATE TABLE products (
                          id bigserial not null primary key,
                          alias varchar not null unique,
                          created_at timestamp not null,
                          deleted bool not null,
                          enabled bool not null,
                          image varchar,
                          name varchar not null unique,
                          updated_at timestamp not null,
                          uuid uuid not null unique
);

ALTER TABLE products
    ADD COLUMN catalog_alias varchar,
    ADD FOREIGN KEY (catalog_alias) REFERENCES catalogs(alias);