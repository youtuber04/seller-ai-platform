# Seller AI SaaS Cloudflare

쇼핑몰 셀러용 AI SaaS 실서비스 개발 시작 패키지입니다.

## 기술 스택
- Frontend: React + Vite
- Hosting: Cloudflare Pages
- Backend: Cloudflare Pages Functions
- DB: Cloudflare D1
- Storage: Cloudflare R2
- AI: OpenAI API
- Payment: 토스페이먼츠 또는 Stripe 연결 준비

## 포함 기능
- 로그인/회원가입 API 샘플
- AI 기능 12종 메뉴
- AI 생성 API 엔드포인트
- 크레딧 차감 로직 샘플
- 결제 생성 API 샘플
- 쿠폰 생성 API 샘플
- 관리자 통계 API 샘플
- D1 DB schema.sql
- Cloudflare 배포 가이드

## 로컬 실행
```bash
npm install
npm run dev
```

## 빌드
```bash
npm run build
```

## Cloudflare Pages 배포
1. GitHub에 이 프로젝트 업로드
2. Cloudflare Pages에서 GitHub 저장소 연결
3. Build command: `npm run build`
4. Build output directory: `dist`
5. D1 / R2 바인딩 추가
6. 환경변수 등록
