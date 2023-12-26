CREATE TABLE catalog_images (
                             id bigserial NOT NULL PRIMARY KEY,
                             catalog_id bigint NOT NULL,
                             url VARCHAR NOT NULL,
                             CONSTRAINT fk_catalog_id FOREIGN KEY (catalog_id) REFERENCES catalogs (id)
);
