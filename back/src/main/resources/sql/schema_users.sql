CREATE TABLE users (
    user_id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username       VARCHAR(50) NOT NULL UNIQUE,
    password_hash  VARCHAR(100) NOT NULL,
    nickname       VARCHAR(50) NOT NULL,
    profile_image  TEXT,
    role           VARCHAR(10) NOT NULL DEFAULT 'USER',
    created_at     TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE sessions (
    session_token  VARCHAR(64) PRIMARY KEY,
    user_id        BIGINT NOT NULL REFERENCES users(user_id),
    created_at     TIMESTAMP NOT NULL DEFAULT now()
);
