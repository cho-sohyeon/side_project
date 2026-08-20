CREATE TABLE interest_topics (
    topic_code  VARCHAR(30) PRIMARY KEY,
    created_at  TIMESTAMP NOT NULL DEFAULT now()
);
