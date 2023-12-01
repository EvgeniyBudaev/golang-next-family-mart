CREATE TABLE selectables (
                             id bigserial not null primary key,
                             created_at timestamp not null,
                             deleted bool not null,
                             enabled bool not null,
                             updated_at timestamp not null,
                             uuid uuid not null unique,
                             value varchar not null unique
);

ALTER TABLE selectables
    ADD COLUMN attribute_id bigint,
    ADD FOREIGN KEY (attribute_id) REFERENCES attributes(id);