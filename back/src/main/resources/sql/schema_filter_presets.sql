CREATE TABLE filter_presets (
    preset_id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    preset_name        VARCHAR(100) NOT NULL,
    start_year_month   VARCHAR(7),
    end_year_month      VARCHAR(7),
    categories           VARCHAR(500),
    created_at            TIMESTAMP NOT NULL DEFAULT now()
);
