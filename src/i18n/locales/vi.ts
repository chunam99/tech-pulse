export const vi = {
  meta: {
    title: "Tech Pulse — Việc làm IT, GitHub Trending & VPS",
    titleTemplate: "%s | Tech Pulse",
    description:
      "Tổng hợp việc làm IT remote, GitHub trending và so sánh giá VPS cho developer.",
  },
  nav: {
    home: "Trang chủ",
    jobs: "Việc làm",
    trending: "GitHub Trending",
    hosting: "So sánh VPS",
  },
  theme: {
    light: "Sáng",
    dark: "Tối",
    system: "Hệ thống",
    toggle: "Đổi giao diện",
  },
  locale: {
    label: "Ngôn ngữ",
    vi: "Tiếng Việt",
    en: "English",
  },
  footer: {
    text: "Tech Pulse — Việc làm IT, GitHub Trending & so sánh VPS. Dữ liệu từ RemoteOK, GitHub API và bảng giá công khai.",
  },
  home: {
    hero: {
      tagline: "Tech Pulse",
      title: "Việc làm IT, GitHub Trending & so sánh VPS",
      description:
        "Tổng hợp job remote, repo hot trên GitHub và bảng giá VPS — cập nhật tự động, tối ưu SEO.",
      ctaJobs: "Xem việc làm",
      ctaTrending: "GitHub Trending",
      ctaHosting: "So sánh VPS",
    },
    features: {
      jobs: {
        title: "Việc làm IT",
        description: "Job remote từ RemoteOK, lọc theo stack và tìm kiếm.",
      },
      trending: {
        title: "GitHub Trending",
        description: "Repo mới nổi theo ngôn ngữ, cập nhật qua GitHub API.",
      },
      hosting: {
        title: "So sánh VPS",
        description: "Bảng giá DigitalOcean, Vultr, Hetzner, Contabo...",
      },
    },
    preview: {
      jobsTitle: "Việc làm mới",
      trendingTitle: "Trending",
      hostingTitle: "VPS giá tốt",
      viewAll: "Xem tất cả →",
      compare: "So sánh →",
    },
  },
  jobs: {
    metaTitle: "Việc làm IT Remote",
    metaDescription: "Tổng hợp việc làm IT remote từ RemoteOK, lọc theo stack.",
    title: "Việc làm IT",
    description: "Job remote cập nhật từ RemoteOK. Lọc theo tag hoặc tìm kiếm.",
    searchPlaceholder: "Tìm theo title, công ty, tag...",
    search: "Tìm",
    all: "Tất cả",
    emptyTitle: "Chưa có việc làm",
    emptyDescription:
      "Chạy đồng bộ dữ liệu qua API /api/cron/sync hoặc đợi cron tự chạy.",
    viewOriginal: "Xem tin gốc →",
    remote: "Remote",
    backToList: "← Danh sách việc làm",
    salary: "Lương",
    location: "Địa điểm",
    posted: "Đăng",
    source: "Nguồn",
    apply: "Ứng tuyển / Xem tin gốc",
    notFound: "Không tìm thấy",
    detailDescription: "Việc làm {title} — {company}. Tags: {tags}",
  },
  trending: {
    metaTitle: "GitHub Trending",
    metaDescription: "Repo GitHub trending theo ngôn ngữ, cập nhật hàng tuần.",
    title: "GitHub Trending",
    description:
      "Repo được tạo trong 7 ngày qua, sắp xếp theo stars (GitHub Search API).",
    emptyTitle: "Chưa có repo trending",
    emptyDescription:
      "Thêm GITHUB_TOKEN vào .env và gọi /api/cron/sync để đồng bộ.",
  },
  hosting: {
    metaTitle: "So sánh VPS / Hosting",
    metaDescription:
      "So sánh giá VPS DigitalOcean, Vultr, Hetzner, Contabo theo RAM và giá.",
    title: "So sánh VPS",
    description:
      "Bảng giá tham khảo các nhà cung cấp phổ biến. Gói rẻ nhất theo $/GB RAM được highlight.",
    compareTitle: "Bảng so sánh ($/GB RAM)",
    disclaimer:
      "* Giá tham khảo, có thể thay đổi. Kiểm tra trang chính thức trước khi mua. Một số link có thể dùng cho affiliate sau này.",
    all: "Tất cả",
    minRam: "RAM tối thiểu",
    maxPrice: "Giá tối đa",
    filter: "Lọc",
    perMonth: "/tháng",
    bandwidth: "băng thông",
    viewOfficial: "Xem giá chính thức →",
    emptyTitle: "Không có gói phù hợp",
    emptyDescription: "Thử bỏ bớt bộ lọc hoặc xem tất cả nhà cung cấp.",
    table: {
      provider: "Nhà cung cấp",
      plan: "Gói",
      ram: "RAM",
      vcpu: "vCPU",
      ssd: "SSD",
      price: "Giá/tháng",
      perGb: "$/GB RAM",
    },
  },
  time: {
    today: "Hôm nay",
    yesterday: "Hôm qua",
    daysAgo: "{count} ngày trước",
    weeksAgo: "{count} tuần trước",
    monthsAgo: "{count} tháng trước",
  },
};

export type Messages = typeof vi;
