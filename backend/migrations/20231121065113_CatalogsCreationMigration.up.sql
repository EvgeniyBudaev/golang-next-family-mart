CREATE TABLE catalogs (
                          id bigserial not null,
                          alias varchar not null unique primary key,
                          created_at timestamp not null,
                          deleted bool not null,
                          enabled bool not null,
                          image varchar,
                          name varchar not null unique,
                          updated_at timestamp not null,
                          uuid uuid not null unique
);