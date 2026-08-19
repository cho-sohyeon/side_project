CREATE TABLE profiles (
    profile_id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    age_household_type          VARCHAR(20) NOT NULL,
    has_subscription_account    BOOLEAN NOT NULL,
    living_type                 VARCHAR(20) NOT NULL,
    spending_habit_type         VARCHAR(20) NOT NULL,
    investment_propensity_type  VARCHAR(20) NOT NULL,
    created_at                  TIMESTAMP NOT NULL DEFAULT now(),
    updated_at                  TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE survey_responses (
    response_id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    profile_id        BIGINT NOT NULL REFERENCES profiles(profile_id),
    survey_type       VARCHAR(30) NOT NULL,
    survey_version    INT NOT NULL DEFAULT 1,
    question_code     VARCHAR(20) NOT NULL,
    selected_option   CHAR(1) NOT NULL,
    created_at        TIMESTAMP NOT NULL DEFAULT now()
);
