CREATE TABLE category_budgets (
    budget_id      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id        BIGINT NOT NULL REFERENCES users(user_id),
    year_month     VARCHAR(7) NOT NULL,
    category       VARCHAR(50) NOT NULL,
    target_amount  NUMERIC(12, 2) NOT NULL,
    created_at     TIMESTAMP NOT NULL DEFAULT now(),
    UNIQUE (user_id, year_month, category)
);
