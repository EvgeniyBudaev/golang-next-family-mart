CREATE TABLE selectables (
                             id BIGSERIAL NOT NULL PRIMARY KEY,
                             created_at TIMESTAMP NOT NULL,
                             deleted bool NOT NULL,
                             enabled bool NOT NULL,
                             updated_at TIMESTAMP NOT NULL,
                             uuid uuid NOT NULL UNIQUE,
                             value varchar NOT NULL UNIQUE
);

ALTER TABLE selectables
    ADD COLUMN attribute_id BIGINT,
    ADD FOREIGN KEY (attribute_id) REFERENCES attributes(id);