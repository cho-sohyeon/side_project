-- budget_goals.year_month, trend_guide_cache.cache_key는 이미 UNIQUE 제약으로 인덱스가 걸려 있어 제외.
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON expenses (expense_date);
CREATE INDEX IF NOT EXISTS idx_survey_responses_profile_id ON survey_responses (profile_id);
