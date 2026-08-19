# AGENTS.md

## 1. 프로젝트 목적
TrendLedger AI는 사용자의 소비 습관을 기록하고, 절약한 금액에 맞춰 트렌드 투자 정보를 제공하는 서비스입니다.
- 자연어 한 줄 입력으로 지출을 기록하면 AI가 자동으로 카테고리를 분류합니다.
- 지출 기록을 카테고리별/월별로 조회하고 소비 패턴을 대시보드로 확인할 수 있습니다.
- 절약액 규모(티어)에 맞는 트렌드 투자 가이드를 뉴스 요약 카드 형태로 제공합니다.

## 2. Frontend 기술
- React (Vite 기반)
- 프로젝트 위치: `front/`
- 실행: `npm run dev` (front 디렉토리 내에서)

## 3. Backend 기술
- Java 21
- Spring Boot
- MyBatis
- Gradle (wrapper 사용, `gradlew` / `gradlew.bat`)
- 프로젝트 위치: `back/`
- 실행: `./gradlew bootRun` (back 디렉토리 내에서)

## 4. Database
- **Supabase(PostgreSQL)** 사용 — 초기 계획은 Oracle 21c였으나, 프로젝트 진행 중 Supabase(PostgreSQL)로 최종 결정되었습니다.
- 드라이버: `org.postgresql:postgresql` (`back/build.gradle`)
- 접속 방식: **Connection Pooler(Session mode, 포트 5432)** 사용
  - 이유: Supabase의 Direct Connection(포트 5432, `db.<project-ref>.supabase.co`)은 IPv6 전용 호스트라, 로컬 개발 환경에 IPv6 라우팅이 안 되어 있으면 연결 자체가 실패합니다. Pooler(`aws-0-<region>.pooler.supabase.com`)는 IPv4를 지원해 이 문제를 우회합니다.
  - 접속 정보는 `back/.env`의 `DB_URL`, `DB_USER`, `DB_PASSWORD`로 관리 (8번 규칙 참고)
- 매퍼 XML은 **PostgreSQL 문법** 기준으로 작성합니다 (Oracle의 `SEQUENCE`/`DUAL` 대신 `GENERATED ALWAYS AS IDENTITY`, `to_char()` 등 사용)
- 테이블 생성(DDL)은 자동 마이그레이션 없이 `back/src/main/resources/sql/*.sql` 파일로 관리하며, Supabase에 수동으로 실행합니다.

### 사용 중인 테이블
| 테이블 | 용도 | 관련 DDL |
|---|---|---|
| `expenses` | 지출 기록 | `sql/schema.sql` |
| `filter_presets` | 대시보드 조회 조건 프리셋 | `sql/schema_filter_presets.sql` |
| `profiles` | 사용자 프로필(기본정보 + 산정된 소비습관/투자성향 유형) | `sql/schema_profiles.sql` |
| `survey_responses` | 프로필 설문 원본 응답 이력 | `sql/schema_profiles.sql` |
| `budget_goals` | 월별 예산 목표 | `sql/schema_budget_goals.sql` |
| `trend_guide_cache` | 절약 티어별 트렌드 가이드 캐시 (1일 유효) | `sql/schema_trend_guide_cache.sql` |

## 5. Backend 기본 구조
```
back/src/main/java/com/trendledger/
├── BackApplication.java   # Spring Boot 시작 클래스
├── controller/             # REST API 엔드포인트
├── service/                 # 비즈니스 로직, 외부 API 클라이언트
├── mapper/                  # MyBatis 매퍼 인터페이스
└── domain/                  # VO/DTO

back/src/main/resources/
├── application.properties  # 앱 설정 (DB, 포트 등)
└── mapper/                  # MyBatis 매퍼 XML
```
새로운 기능을 추가할 때도 이 구조를 유지합니다 (controller → service → mapper 흐름).

## 6. REST API 사용
- Frontend와 Backend는 REST API로 통신합니다.
- Backend는 `@RestController` 기반으로 JSON 요청/응답을 처리합니다.
- Frontend는 `front/.env`의 `VITE_API_BASE_URL`을 기준으로 API를 호출합니다.
- 새 엔드포인트 추가 시 기존 URL 패턴 및 응답 형식과 일관성을 유지합니다.

## 7. 불필요한 Library 추가 금지
- 이미 선정된 스택(React/Vite, Spring Boot/MyBatis) 범위 안에서 구현합니다.
- 새로운 라이브러리나 의존성이 꼭 필요하다고 판단되면, 추가하기 전에 사용자에게 먼저 이유를 설명하고 확인을 받습니다.
- 기능 하나를 위해 무거운 프레임워크나 중복 기능의 라이브러리를 들여오지 않습니다.

## 8. Secret을 코드에 직접 작성하지 않기
- API 키, DB 접속 정보 등은 반드시 `.env` 파일(`back/.env`, `front/.env`)을 통해 관리합니다.
- 코드나 설정 파일(`application.properties` 등)에는 실제 값 대신 `${ENV_VAR}` 형태의 참조만 작성합니다.
- `.env` 파일은 `.gitignore`에 포함되어 커밋되지 않도록 유지합니다.

## 9. 기존 파일을 대량으로 삭제하지 않기
- 리팩토링이나 정리가 필요하더라도 사용자 확인 없이 여러 파일을 한번에 삭제하지 않습니다.
- 불필요해 보이는 파일이 있으면 삭제 전에 먼저 사용자에게 알리고 승인을 받습니다.

## 10. 큰 변경 전에 계획 먼저 설명하기
- 여러 파일에 걸치거나 구조에 영향을 주는 변경은 작업 시작 전에 무엇을 어떻게 바꿀지 먼저 설명합니다.
- 사용자 동의 후에 실제 코드 변경을 진행합니다.

## 11. 구현 후 Build 또는 테스트하기
- Backend 변경 후: `./gradlew build` 또는 `./gradlew bootRun`으로 정상 기동 확인
- Frontend 변경 후: `npm run dev` 또는 `npm run build`로 정상 동작 확인
- 실행/빌드에 실패하면 오류 내용을 숨기지 않고 그대로 보고합니다.

## 12. 변경한 파일을 작업 마지막에 설명하기
- 작업을 마칠 때 새로 생성/수정/삭제한 파일 목록과 각 파일의 변경 내용을 간단히 정리해서 알려줍니다.
