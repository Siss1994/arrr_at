# arrr.at - Games & Utils Gateway

게임과 유틸리티 컬렉션 사이트입니다.

## 🌐 사이트 구조

```
arrr.at/              → 게이트웨이 랜딩 페이지
arrr.at/cube/         → 루빅스 큐브 게임
arrr.at/mining/       → 광물캐기 게임
pdf.arrr.at           → PDF 압축 도구 (별도 서브도메인)
```

## 📁 프로젝트 구조

```
arrr_at/
├── index.html           # 게이트웨이 랜딩 페이지
├── cube/
│   ├── index.html       # 루빅스 큐브 게임
│   └── strings.js       # 다국어 번역 파일
├── mining/
│   └── index.html       # 광물캐기 게임
├── CNAME                # 커스텀 도메인 설정
├── Ads.txt              # Google AdSense
└── README.md
```

## 🎮 게임 소개

### 1. 루빅스 큐브 (`/cube/`)
- **장르**: 3D 퍼즐
- **특징**:
  - 일반 모드 / 대회 모드
  - WCA 규칙 준수 (검사 시간, 패널티)
  - 6개 언어 지원 (한/중/영/일/아/힌)
  - 자동 해법 기능
  - 세션 리더보드

### 2. 광물캐기 (`/mining/`)
- **장르**: RPG + 채굴 시뮬레이션
- **특징**:
  - 레트로 픽셀 아트
  - 21종 광물 수집
  - 8종 곡괭이 업그레이드
  - 날씨 시스템 (버프)
  - 캐릭터 커스터마이징 (30종)
  - 로컬 저장 지원

## 🚀 로컬 실행

```bash
# 웹 서버 실행
python3 -m http.server 8000

# 브라우저에서 접속
http://localhost:8000
```

## 🌐 배포

- **호스팅**: GitHub Pages
- **도메인**: arrr.at
- **Google Analytics**: G-CW8LKN79ZD
- **Google AdSense**: ca-pub-3400178376584781

## 📝 라이선스

개인 프로젝트 - All Rights Reserved
