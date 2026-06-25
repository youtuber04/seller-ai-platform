# Cloudflare 배포 순서

## 1. GitHub 업로드
ZIP 압축을 풀고 프로젝트 폴더 전체를 GitHub 저장소에 업로드합니다.

## 2. Cloudflare Pages 연결
- Cloudflare Dashboard
- Workers & Pages
- Create application
- Pages
- Connect to Git
- 저장소 선택

## 3. 빌드 설정
- Framework preset: Vite
- Build command: npm run build
- Build output directory: dist

## 4. D1 데이터베이스 생성
```bash
wrangler d1 create seller_ai_db
wrangler d1 execute seller_ai_db --file=./schema/schema.sql
```

Cloudflare Pages 설정에서 D1 바인딩:
- Variable name: DB
- Database: seller_ai_db

## 5. R2 버킷 생성
- R2 bucket: seller-ai-files
- Pages binding name: FILES

## 6. 환경변수/시크릿
Cloudflare Pages > Settings > Environment variables

필수:
- OPENAI_API_KEY
- JWT_SECRET

선택:
- TOSS_SECRET_KEY
- STRIPE_SECRET_KEY

## 7. 실제 출시 전 필수 보완
- 비밀번호 해시 bcrypt 또는 WebCrypto PBKDF2 적용
- 세션 쿠키 httpOnly 적용
- 관리자 권한 체크
- 결제 웹훅 검증
- 크레딧 차감 트랜잭션 강화
- 파일 업로드 보안 검사
