# TrendLedger AI 🐷

**소비 습관을 기록하면, 절약한 만큼 투자 트렌드를 알려주는 AI 재테크 가계부**

지출을 한 줄만 입력하면 AI가 자동으로 분류해주고, 이번 달 얼마나 절약했는지에 따라 지금 나에게 맞는 투자 트렌드 뉴스를 큐레이션해줍니다. 예산 관리, 반복 지출 자동화, 무지출 챌린지 같은 가계부 기능부터 AI 재테크 상담 챗봇까지 한 곳에서 관리할 수 있는 개인 재테크 앱입니다.

## 서비스 소개

"돈을 아꼈으면, 그다음엔 뭘 해야 하지?"라는 질문에서 출발한 서비스입니다.

일반 가계부 앱은 지출을 기록하고 통계를 보여주는 데서 끝나지만, TrendLedger AI는 한 걸음 더 나아가 사용자의 절약 성과와 투자 성향, 소비 습관을 종합해 **지금 이 사람에게 필요한 재테크 정보**를 뉴스 카드와 챗봇 상담 형태로 제공합니다. 사용자마다 경제 상황과 투자 성향이 다르다는 전제 아래, 뻔한 일반론이 아니라 실제 데이터에 근거한 맞춤 조언을 지향합니다.

## 핵심 기능

### 💰 지출 기록 & 자동 분류
- 자연어 한 줄 입력("스타벅스 아메리카노 4500원")만으로 지출을 등록하면 AI(OpenAI `gpt-4o-mini`)가 카테고리(식비/교통/쇼핑/주거/여가/금융투자/기타)를 자동 분류합니다.
- 은행 CSV 파일을 가져와 한 번에 여러 건을 등록할 수 있습니다(대량 등록).
- 정산(더치페이) 여부를 구분해 실제 순지출과 대비/정산 예정 금액을 분리 관리합니다.

### 📊 대시보드 & 리포트
- 카테고리별/월별 소비 통계를 그래프로 확인합니다.
- 월간 리포트로 이번 달 소비 요약과 전월 대비 변화를 확인합니다.
- 소비 추이 차트와 캘린더 뷰로 지출 패턴을 시각적으로 파악합니다.

### 🎯 예산 목표 & 자동화
- 월별 전체 예산 목표를 설정하고 달성률을 추적합니다.
- 카테고리별로 세부 예산을 잡고 초과 여부를 확인합니다.
- 매달 반복되는 고정 지출(구독료, 월세 등)을 등록하면 자동으로 매월 지출 내역에 반영됩니다.
- 무지출 챌린지로 소비를 참은 날을 기록하고 동기부여를 얻습니다.

### 📈 맞춤형 트렌드 투자 가이드
- 이번 달 절약 규모(티어)에 따라 관심 토픽(청약/주식/코인 등)의 최신 뉴스를 카드 형태로 큐레이션합니다.
- 단순 뉴스 요약이 아니라, 사용자의 절약 티어·투자 성향·소비 습관·연령대/가구유형에 맞춰 **"지금 이 뉴스에서 무엇을 확인하면 좋을지"** 실행 조언까지 함께 제공합니다.
- 새로고침 버튼으로 최신 뉴스를 다시 불러올 수 있습니다.

### 💬 AI 재테크 상담 챗봇 (Ledger)
- 메신저 형태의 채팅 UI로 재테크 관련 질문에 답합니다.
- 사용자의 실제 재무 현황(순지출/잔액/예산/절약 티어/프로필)에 근거해 답하며, 되묻지 않고 한 번에 구체적인 행동 방안을 여러 개 제시합니다. (프로필·지출 기록이 쌓일수록 답변이 더 구체적이고 개인화됩니다.)
- 답변은 번호(1, 2, 3...) 항목마다 각각 하나의 말풍선으로, 최대 4개까지만 나뉘어 표시됩니다 — 항목과 예시가 뒤섞이지 않도록 서버에서 말풍선 경계를 직접 관리합니다.
- 무엇을 물어봐야 할지 모를 때 참고할 수 있는 FAQ 버튼을 제공합니다.
- 실제 존재하는 금융상품명이나 확정 수익률은 언급하지 않고, 마크다운 서식 없이 순수 텍스트로만 답하는 등 안전한 답변 가이드라인을 지킵니다.

### 👤 계정 & 프로필
- 아이디/비밀번호 기반 회원가입·로그인 (사용자별로 데이터가 독립적으로 저장됩니다).
- 프로필 사진을 업로드해 아바타로 설정할 수 있습니다.
- 온보딩 설문으로 소비 습관 유형과 투자 성향을 산정해 프로필에 반영합니다.
- 비밀번호 변경, 세션 자동 만료, 회원 탈퇴를 지원합니다.

### 🛠️ 관리자 대시보드
- 관리자(admin) 권한 계정으로 로그인하면 하단 탭에 전용 메뉴가 추가로 표시됩니다.
- 전체 회원의 가입일, 지출/수입 기록 건수, 총 지출·총 수입 합계를 한 화면에서 확인할 수 있습니다.
- 일반 계정으로는 접근할 수 없고, 관리자 권한이 있는 계정으로 로그인했을 때만 보입니다.

## 사용 방법

1. **회원가입 후 로그인**합니다.
2. 처음 로그인하면 **온보딩 설문**을 통해 기본 정보(연령대/가구유형)와 소비 습관, 투자 성향을 등록합니다.
3. **거래입력** 탭에서 지출/수입을 한 줄로 입력하면 AI가 자동 분류한 결과를 확인 후 저장합니다.
4. **목표·절약** 탭에서 이번 달 예산 목표를 등록하고, 오늘의 절약 현황과 무지출 챌린지 진행 상황을 확인합니다.
5. **투자트렌드** 탭에서 내 절약 티어에 맞춘 뉴스 카드와 맞춤 추천을 확인합니다.
6. **Ledger** 탭에서 구체적인 재테크 질문을 채팅으로 물어봅니다. 뭘 물어봐야 할지 모르겠다면 FAQ 버튼을 눌러보세요.
7. **프로필** 탭에서 닉네임/기본정보/프로필 사진을 수정하거나 비밀번호를 변경할 수 있습니다.
8. 관리자 계정이라면 **관리자** 탭에서 전체 회원 현황을 확인할 수 있습니다.

## 기술 스택

| 구분 | 스택 |
|---|---|
| Frontend | React (Vite) |
| Backend | Java 21, Spring Boot, MyBatis, Gradle |
| DB | PostgreSQL (Supabase, Session Pooler) |
| 인증 | 자체 세션 토큰 기반 인증 (BCrypt 비밀번호 해시) |
| 외부 API | OpenAI (`gpt-4o-mini`) — 지출 분류·뉴스 인사이트·챗봇 / 네이버 뉴스 검색 API |
| 배포 | Coolify (GitHub 웹훅 연동 자동 배포) |

## 프로젝트 구조

```
side_project/
├── back/    # Spring Boot 백엔드 (포트 8080)
│   └── src/main/java/com/trendledger/
│       ├── controller/   # REST API 엔드포인트
│       ├── service/      # 비즈니스 로직, 외부 API 클라이언트
│       ├── mapper/       # MyBatis 매퍼 인터페이스
│       └── domain/       # VO/DTO
└── front/   # React 프론트엔드 (포트 5173)
    └── src/components/
```

## 개발 환경 설정

### 1. 사전 준비

- Java 21
- Node.js (18 이상 권장)
- Supabase(PostgreSQL) 프로젝트, OpenAI API 키, 네이버 검색 API 키

### 2. 환경 변수 설정

`back/.env` 파일을 생성합니다.

```env
DB_URL=jdbc:postgresql://<supabase-pooler-host>:5432/postgres
DB_USER=postgres.<project-ref>
DB_PASSWORD=<db-password>
OPENAI_API_KEY=<openai-api-key>
NAVER_CLIENT_ID=<naver-client-id>
NAVER_CLIENT_SECRET=<naver-client-secret>
```

`front/.env` 파일을 생성합니다.

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 3. 데이터베이스 테이블 생성

자동 마이그레이션이 없으므로 `back/src/main/resources/sql/` 아래 파일들을 Supabase SQL Editor(또는 `psql`)에서 순서대로 실행합니다.

```
schema_users.sql
schema_multi_user.sql
schema_session_expiry.sql
schema_user_role.sql
schema_profile_image.sql
schema.sql
schema_profiles.sql
schema_filter_presets.sql
schema_budget_goals.sql
schema_category_budgets.sql
schema_recurring_expenses.sql
schema_trend_guide_cache.sql
schema_interest_topics.sql
schema_expense_type.sql
schema_chat_messages.sql
schema_indexes.sql
```

### 4. 백엔드 실행

```bash
cd back
./gradlew bootRun
```

정상 기동 확인:

```bash
curl http://localhost:8080/health
# OK
```

### 5. 프론트엔드 실행

```bash
cd front
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

## API 사용 예시

인증이 필요한 API는 로그인 후 발급받은 토큰을 `X-Auth-Token` 헤더에 담아 요청합니다.

### 회원가입

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser01","password":"testpass123","nickname":"홍길동"}'

# {"token":"발급된 토큰", "nickname":"홍길동"}
```

- `username`: 영문/숫자 4~20자
- `password`: 8자 이상
- `nickname`: 1자 이상

### 로그인

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser01","password":"testpass123"}'
```

### 지출 등록

```bash
TOKEN="발급받은 토큰"

curl -X POST http://localhost:8080/api/expenses \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: $TOKEN" \
  -d '{
    "expenseDesc": "스타벅스 아메리카노",
    "amount": 4500,
    "expenseDate": "2026-08-25",
    "category": "식비",
    "isTrendRelated": false,
    "transactionType": "EXPENSE",
    "isSettlement": false
  }'
```

- `amount`는 최대 9,999,999,999,999.99원까지 등록 가능하며, 초과 시 500이 아닌 400 에러와 함께 안내 메시지를 반환합니다.

### 지출 내역 조회

```bash
curl http://localhost:8080/api/expenses -H "X-Auth-Token: $TOKEN"
```

### AI 재테크 상담 챗봇

```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: $TOKEN" \
  -d '{"message":"소액으로 투자 어떻게 시작하면 좋을까요?"}'
```

### 프로필 사진 변경

```bash
curl -X PUT http://localhost:8080/api/account/profile-image \
  -H "Content-Type: application/json" \
  -H "X-Auth-Token: $TOKEN" \
  -d '{"profileImage":"data:image/jpeg;base64,<base64 인코딩된 이미지>"}'
```

- 이미지는 base64 문자열로 DB에 저장되며, 원본 기준 약 500KB(base64로는 약 700,000자)를 넘으면 거부됩니다.
- 프론트엔드는 업로드 전 정사각형 160x160으로 자동 리사이즈해 용량을 줄입니다.

### 관리자 대시보드 조회 (관리자 권한 필요)

```bash
curl http://localhost:8080/api/admin/users -H "X-Auth-Token: $ADMIN_TOKEN"
```

- 관리자가 아닌 계정으로 호출하면 403과 함께 "관리자만 접근할 수 있습니다." 메시지를 반환합니다.
- 계정을 관리자로 지정하려면 DB에서 직접 `UPDATE users SET role = 'ADMIN' WHERE username = '<아이디>';`를 실행합니다(별도 승격 API는 없습니다).

## 배포

- 배포 서버는 [Coolify](https://coolify.io)를 통해 GitHub 저장소와 연동되어 있습니다.
- `main` 브랜치에 push하면 등록된 웹훅(GitHub → Coolify)을 통해 자동으로 재배포됩니다.
- 자동 배포가 붙어있지 않다면 GitHub 저장소 **Settings → Webhooks**에서 Coolify가 제공하는 Payload URL/Secret으로 웹훅을 등록해야 합니다.

## 개발 가이드

프로젝트 구조, 코딩 규칙 등 더 자세한 개발 가이드는 [AGENTS.md](./AGENTS.md)를 참고하세요.
