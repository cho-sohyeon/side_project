-- 기존 단일 사용자 데이터를 다중 사용자 구조로 전환한다.
-- 첫 회원가입자에게 user_id가 NULL인 기존 데이터를 자동으로 귀속시키는 로직은
-- UserService.claimOrphanedData()에서 처리한다.

ALTER TABLE expenses ADD COLUMN IF NOT EXISTS user_id BIGINT REFERENCES users(user_id);
ALTER TABLE budget_goals ADD COLUMN IF NOT EXISTS user_id BIGINT REFERENCES users(user_id);
ALTER TABLE filter_presets ADD COLUMN IF NOT EXISTS user_id BIGINT REFERENCES users(user_id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_id BIGINT REFERENCES users(user_id);

ALTER TABLE budget_goals DROP CONSTRAINT IF EXISTS budget_goals_year_month_key;
ALTER TABLE budget_goals ADD CONSTRAINT budget_goals_user_year_month_key UNIQUE (user_id, year_month);

ALTER TABLE profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);

-- interest_topics는 PK가 topic_code 단독이라 사용자별 구분이 불가능했다.
-- 기존 선택값은 사소한 데이터라 초기화하고 (user_id, topic_code) 복합키로 재구성한다.
DELETE FROM interest_topics;
ALTER TABLE interest_topics DROP CONSTRAINT IF EXISTS interest_topics_pkey;
ALTER TABLE interest_topics ADD COLUMN IF NOT EXISTS user_id BIGINT NOT NULL REFERENCES users(user_id);
ALTER TABLE interest_topics ADD PRIMARY KEY (user_id, topic_code);
