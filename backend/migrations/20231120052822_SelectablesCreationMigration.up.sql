CREATE TABLE selectables (
                             id bigserial not null primary key,
                             value varchar not null unique
);

ALTER TABLE selectables
    ADD COLUMN attribute_id bigint,
    ADD FOREIGN KEY (attribute_id) REFERENCES attributes(id);