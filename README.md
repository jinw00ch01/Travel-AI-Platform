# 서버리스 아키텍처 기반 AI 여행 서비스 - 제안서

## 1. 초기 개발

- **서버리스 플랫폼**: AWS Lambda + API Gateway 사용
  - 이벤트 기반 함수 실행으로 인프라 관리 부담 감소
  - 필요 시점에만 실행되어 비용 효율적

- **인증/인가**: AWS Cognito
  - 소셜 로그인, 회원가입, JWT 토큰 발급 등 통합 관리

- **데이터 저장**: AWS DynamoDB 또는 RDS
  - 여행 일정, 사용자 정보, 예약 내역 등 저장
  - 간단한 구조는 DynamoDB(서버리스) 사용, 관계형 구조는 RDS 고려

- **파일 스토리지**: Amazon S3
  - 사용자가 업로드한 이미지·동영상 파일 관리
  - 정적 웹 호스팅 가능(React SPA 등)

- **AI 모델 연동**:
  - OpenAI 사용 (GPT API) → 텍스트 기반 여행 플랜, 사용자 맞춤 추천
  - AWS Rekognition/SageMaker → 이미지·동영상 분석
  - (추가) Amazon Personalize → 추천 알고리즘

---

## 2. 추천 기술 스택

- **프론트엔드**:  
  - React.js (SPA 구조)  
  - Tailwind CSS (UI 스타일링)  
  - AWS Amplify (Cognito 인증 및 GraphQL/API Gateway 연동 시 편의성↑)  

- **백엔드(서버리스)**:  
  - AWS Lambda (핵심 로직)  
  - AWS API Gateway (API 인터페이스)  
  - AWS Cognito (인증/인가)
  - AWS DynamoDB or RDS (DB)  
  - AWS S3 (파일 스토리지)  

- **AI/ML 서비스**:  
  - **OpenAI GPT API** (날짜·예산·목적지 입력 시 여행 일정 생성)  
  - **AWS Rekognition** (이미지/동영상 태깅, 랜드마크 분석)  
  - **Amazon Personalize** (고객 선호도 기반 추천, 선택 사항)  

---

## 3. 배포 방식

1. **AWS Lambda를 이용한 함수 배포**  
   - 로컬에서 코드 작성 → AWS CLI 또는 CD 파이프라인(예: GitHub Actions)으로 Lambda에 배포  
   - 서버 구성 없이 자동 확장(Auto Scaling)

2. **API Gateway 설정**  
   - HTTP API 또는 REST API 중 선택  
   - Cognito로 사용자 인증 연결  
   - CORS 설정, 리소스 경로 지정

3. **프론트엔드 배포 방식**  
   - Amazon S3 정적 웹 호스팅  
   - 또는 AWS Amplify Hosting을 사용해 CI/CD 구성

4. **인증/인가 설정**  
   - Cognito User Pool로 회원가입, 소셜 로그인(Facebook, Google) 통합  
   - JWT 토큰 기반 API 호출 (API Gateway → Lambda)

5. **인프라 IaC(Infrastructure as Code) 고려**  
   - AWS SAM(Serverless Application Model), AWS CDK(Cloud Development Kit)  
   - 배포 자동화, 버전 관리 및 롤백 가능

---

## 4. 확장 계획

1. **마이크로서비스 분리**  
   - 특정 기능(예: 결제 또는 미디어 분석)만 별도 Lambda로 분리  
   - Step Functions를 이용해 여러 Lambda 워크플로우 오케스트레이션

2. **타사 API 연동 확장**  
   - Skyscanner API(항공권 검색), Booking.com API(숙소 검색)  
   - 추가로 카카오/네이버/구글 지도 API를 연동해 교통편, 장소 정보 제공

3. **다양한 추천 알고리즘 추가**  
   - Amazon Personalize로 협업 필터링(다른 사람과 유사 취향 비교)  
   - 사용자 이벤트(클릭·찜·예약) 기반으로 실시간 추천 모델 튜닝

4. **비즈니스 모델 연동**  
   - 결제 모듈(Stripe, PayPal, KG이니시스)로 실제 결제 기능 확장  
   - 예약 및 발권 데이터 관리 → DB에 저장, 스케줄 알림 기능

---

## 5. 핵심 구성 요소

### 5.1. 사용자 인증 (AWS Cognito)
- 이메일/비밀번호 회원가입 및 소셜 로그인
- JWT 토큰 발급 후 API Gateway 호출 시 권한 확인

### 5.2. AI 모델 호출 (AWS Lambda)
- OpenAI GPT API  
  - 텍스트 입력 기반 여행 일정 생성
  - 불만족 시 재생성(프롬프트 수정)

- AWS Rekognition  
  - 이미지/동영상 라벨링, 유사 여행지 검색  

- Amazon Personalize  
  - 사용자 취향 분석, 인기 여행 코스 추천

### 5.3. 데이터베이스 (DynamoDB/RDS)
- **여행 일정**: 사용자별 일정 JSON, 여행지 리스트  
- **예약 정보**: 항공권·숙소 예약 내역, 결제 정보  
- **사용자 정보**: 이메일, 소셜 로그인 정보, 가입 일시  
- **공유 링크**: 유니크 식별자(예: UUID)로 일정 조회 가능

### 5.4. CI/CD 파이프라인
- GitHub Actions or AWS CodePipeline
- 빌드 & 테스트 후 Lambda 함수, S3 정적 사이트 자동 배포
- 에러 발생 시 알림 받기 & 롤백 가능

### 5.5. 보안 및 모니터링
- **보안**:  
  - Cognito로 사용자 인증  
  - IAM 역할/권한 관리  
  - API Gateway에서 WAF(Web Application Firewall) 설정 가능  
  
- **모니터링**:  
  - AWS CloudWatch(Log, Metrics, Alarms)  
  - Lambda 실행 지표(메모리/실행 시간/오류)  
  - DynamoDB, S3 접근 로그

---

## 6. 예시 워크플로우

1. **사용자 요청**  
   - 텍스트 입력(“예산 200만원, 오사카 10일 여행”) 또는 사진 업로드  
   - Cognito 인증 후 API Gateway → Lambda 호출

2. **Lambda 로직**  
   - OpenAI GPT API 호출 → 여행 일정 생성  
   - Rekognition 호출(이미지·동영상 분석) → 유사 여행지 찾기  
   - DynamoDB에 일정 정보 저장

3. **추천 + 협업 필터링**  
   - Amazon Personalize(선택)로 사용자 취향 추천 모델 반영  
   - “다른 사용자는 어떻게 여행했는지” 데이터로 개인화 추천

4. **응답 반환**  
   - Lambda 결과 → API Gateway → 프론트엔드  
   - 사용자 화면에 일정·예산·예약 후보 목록 표시

5. **결제 및 예약**  
   - Stripe/PayPal API로 결제 진행  
   - Lambda → DB 업데이트(예약 내역, 결제 영수증)  
   - 알림 or 이메일 전송

6. **일정 공유**  
   - 공유 링크(예: https://도메인/itinerary/UUID) 생성  
   - 다른 사용자와 여행 일정 확인 가능

---

## 결론

이 아키텍처는 **서버 관리 부담을 줄이고**, **사용량 기반 과금**으로 **비용 효율적**이며, **확장성**과 **유연성**을 모두 잡을 수 있습니다.  
졸업작품 시연에서 **AI 여행 서비스** 기능을 빠르게 구현하기에 적합하며, **추가 확장(결제·추천·미디어 분석 등)**도 손쉽게 해낼 수 있습니다. 