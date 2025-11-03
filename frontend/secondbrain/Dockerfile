# ---------- 1) Build stage: Vite build with pnpm (Node 24) ----------
FROM node:24-alpine AS builder

# 일부 패키지(네이티브 의존성) 호환
RUN apk add --no-cache libc6-compat

WORKDIR /app

# pnpm 활성화 (Corepack)
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@9 --activate

# 의존성 캐시 최적화
# (lockfile이 바뀌지 않으면 install 레이어 재사용)
COPY pnpm-lock.yaml package.json ./

# devDependencies 포함 설치 (vite/ts/router-plugin 필요)
RUN pnpm install --frozen-lockfile

# 소스 복사 & 프로덕션 빌드
COPY . .

# 빌드: tanstackRouter 플러그인이 routeTree.gen.ts 생성
RUN pnpm build

# 빌드 산출물/코드젠 산출물 검증 (디버그에 도움)
# - vite 플러그인은 기본적으로 src/routeTree.gen.ts를 생성함 (경로를 vite.config.ts에서 명시했다면 그 경로로 체크)
RUN test -f ./src/routeTree.gen.ts || (echo >&2 "❌ routeTree.gen.ts 생성 안됨. vite.config.ts의 tanstackRouter 설정과 routes 디렉토리 확인 필요"; exit 1)
RUN test -d ./dist || (echo >&2 "❌ dist 디렉토리 없음. Vite 빌드 실패"; exit 1)

# ---------- 2) Runtime stage: Nginx serve ----------
FROM nginx:1.27-alpine AS runner

# 정적 파일 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 기본 conf 교체 (SPA 라우팅 + 간단 캐시 설정)
RUN rm -f /etc/nginx/conf.d/default.conf && \
    printf '%s\n' \
    'server {' \
    '  listen 80;' \
    '  server_name _;' \
    '  root /usr/share/nginx/html;' \
    '  index index.html;' \
    '  # 정적 에셋 캐싱 (확장자 기준, 필요시 조정)' \
    '  location ~* \.(?:js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$ {' \
    '    try_files $uri =404;' \
    '    add_header Cache-Control "public, max-age=31536000, immutable";' \
    '  }' \
    '  # SPA 라우팅' \
    '  location / {' \
    '    try_files $uri $uri/ /index.html;' \
    '  }' \
    '  location = /health {' \
    '    return 200 "ok";' \
    '    add_header Content-Type text/plain;' \
    '  }' \
    '}' \
    > /etc/nginx/conf.d/app.conf

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://localhost/health || exit 1
