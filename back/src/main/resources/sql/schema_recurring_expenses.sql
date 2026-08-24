CREATE TABLE recurring_expenses (
    recurring_id      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id           BIGINT NOT NULL REFERENCES users(user_id),
    expense_desc      VARCHAR(500) NOT NULL,
    amount            NUMERIC(12, 2) NOT NULL,
    category           VARCHAR(50),
    transaction_type  VARCHAR(10) NOT NULL DEFAULT 'EXPENSE',
    day_of_month      INT NOT NULL,
    is_active         BOOLEAN NOT NULL DEFAULT true,
    created_at        TIMESTAMP NOT NULL DEFAULT now()
);

ALTER TABLE expenses ADD COLUMN IF NOT EXISTS recurring_id BIGINT REFERENCES recurring_expenses(recurring_id);
