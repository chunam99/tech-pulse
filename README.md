# Tech Pulse

Web Next.js tổng hợp **việc làm IT remote**, **GitHub trending** và **so sánh giá VPS**.

## Tính năng

- **Việc làm** — đồng bộ từ [RemoteOK API](https://remoteok.com/api), lọc tag & tìm kiếm
- **GitHub Trending** — repo mới trong 7 ngày qua (GitHub Search API), lọc theo ngôn ngữ
- **So sánh VPS** — bảng giá seed (DigitalOcean, Vultr, Hetzner, Contabo…), sắp theo $/GB RAM

## Cấu trúc thư mục

```
src/
├── app/                    # App Router (pages + API)
├── components/
│   ├── layout/             # Header, Footer, NavLink, PageHeader
│   ├── ui/                 # Badge, Button, Card, EmptyState
│   ├── jobs/               # JobCard, JobList, JobFilters
│   ├── trending/           # RepoCard, TrendingList, LanguageTabs
│   ├── hosting/            # HostingPlanCard, CompareTable, Filters
│   └── home/               # Hero, FeatureCards, HomePreview
├── lib/
│   ├── db/                 # SQLite + Drizzle schema
│   ├── services/           # jobs, github, hosting
│   └── sync/               # syncAll cron
└── types/
```

## Bắt đầu

```bash
cd tech-pulse
cp .env.example .env
# Thêm GITHUB_TOKEN (khuyến nghị)

yarn install
yarn run db:seed
yarn run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Đồng bộ dữ liệu

```bash
# Local
yarn run db:seed

# Hoặc gọi API (cần CRON_SECRET nếu đã set)
curl "http://localhost:3000/api/cron/sync?secret=YOUR_SECRET"
```

Trên Vercel: thêm Cron Job trỏ tới `/api/cron/sync` với header `Authorization: Bearer CRON_SECRET`.

## Biến môi trường

| Biến | Mô tả |
|------|--------|
| `GITHUB_TOKEN` | Token GitHub — tránh rate limit khi sync trending |
| `CRON_SECRET` | Bảo vệ endpoint sync |
| `DATABASE_URL` | Đường dẫn SQLite (mặc định `./data/tech-pulse.db`) |

## Deploy

- **Vercel**: SQLite local không persist giữa các invocation — production nên dùng Turso/Neon hoặc chạy sync trên VPS.
- **VPS/Docker**: giữ file `data/tech-pulse.db` trên volume.

## Mở rộng

- Thêm nguồn job (RSS, API khác)
- Scraper giá VPS thật → cập nhật `syncHosting`
- Affiliate link thật, AdSense khi đủ traffic
- Sitemap & `robots.txt` cho SEO
# tech-pulse
