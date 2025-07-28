# 데이터베이스 백업/복원 가이드

## 설정

1. `.env` 파일 생성:

```bash
cp .env.example .env
```

2. `.env` 파일에 실제 데이터베이스 정보 입력:

```bash
DB_HOST=127.0.0.1
DB_PORT=*
DB_USER=user
DB_PASSWORD=pw
DB_NAME=name
```

## 사용 방법

### 백업

```bash
# npm 스크립트 사용 (권장)
npm run db:backup

# 환경변수 직접 설정
DB_PASSWORD=your_password ./scripts/backup-db.sh
```

### 복원

```bash
# npm 스크립트 사용 (권장)
npm run db:restore ./backups/backup_file.sql.gz

# 환경변수 직접 설정
DB_PASSWORD=your_password ./scripts/restore-db.sh ./backups/backup_file.sql.gz
```

### 안전한 마이그레이션

```bash
# 백업 후 마이그레이션 실행
npm run deploy:safe
```

## 백업 파일 관리

- 백업 파일은 `./backups/` 디렉토리에 저장됩니다
- 자동으로 gzip 압축됩니다
- 7일 이상 된 백업은 자동 삭제됩니다
