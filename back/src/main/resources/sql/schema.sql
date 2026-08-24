CREATE TABLE expenses (
    expense_id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    expense_desc      VARCHAR(500) NOT NULL,
    amount            NUMERIC(15, 2) NOT NULL,
    expense_date      DATE NOT NULL,
    category          VARCHAR(50),
    is_trend_related  BOOLEAN,
    created_at        TIMESTAMP NOT NULL DEFAULT now()
);
