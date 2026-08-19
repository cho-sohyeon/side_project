CREATE TABLE budget_goals (
    goal_id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    year_month     VARCHAR(7) NOT NULL UNIQUE,
    target_amount  NUMERIC(12, 2) NOT NULL,
    created_at     TIMESTAMP NOT NULL DEFAULT now()
);
