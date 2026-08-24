ALTER TABLE sessions ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP;
UPDATE sessions SET expires_at = created_at + interval '30 days' WHERE expires_at IS NULL;
ALTER TABLE sessions ALTER COLUMN expires_at SET NOT NULL;
