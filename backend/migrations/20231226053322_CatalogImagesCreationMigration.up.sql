CREATE TABLE catalog_images (
                             id BIGSERIAL NOT NULL PRIMARY KEY,
                             catalog_id BIGINT NOT NULL,
                             uuid UUID NOT NULL UNIQUE,
                             name VARCHAR NOT NULL,
                             url VARCHAR NOT NULL,
                             size INTEGER NOT NULL,
                             created_at TIMESTAMP NOT NULL,
                             updated_at TIMESTAMP NOT NULL,
                             is_deleted BOOL NOT NULL,
                             is_enabled BOOL NOT NULL,
                             CONSTRAINT fk_catalog_id FOREIGN KEY (catalog_id) REFERENCES catalogs (id)
);
