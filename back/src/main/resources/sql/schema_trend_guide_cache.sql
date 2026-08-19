CREATE TABLE trend_guide_cache (
    cache_id     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cache_key    VARCHAR(300) NOT NULL UNIQUE,
    tier         VARCHAR(20) NOT NULL,
    cards_json   TEXT NOT NULL,
    created_at   TIMESTAMP NOT NULL DEFAULT now(),
    expires_at   TIMESTAMP NOT NULL
);
