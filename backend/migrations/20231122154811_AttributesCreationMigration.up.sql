CREATE TABLE attributes (
                            id BIGSERIAL NOT NULL PRIMARY KEY,
                            catalog_id BIGINT NOT NULL,
                            uuid UUID NOT NULL UNIQUE,
                            alias VARCHAR NOT NULL UNIQUE,
                            name VARCHAR NOT NULL UNIQUE,
                            type VARCHAR NOT NULL,
                            created_at TIMESTAMP NOT NULL,
                            updated_at TIMESTAMP NOT NULL,
                            is_deleted BOOL NOT NULL,
                            is_enabled BOOL NOT NULL,
                            is_filtered bool NOT NULL,
                            CONSTRAINT fk_catalog_id FOREIGN KEY (catalog_id) REFERENCES catalogs (id)
);