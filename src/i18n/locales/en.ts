import type { Messages } from "./vi";

export const en = {
  meta: {
    title: "Tech Pulse — IT Jobs, GitHub Trending & VPS",
    titleTemplate: "%s | Tech Pulse",
    description:
      "IT remote jobs, GitHub trending repos, and VPS price comparison for developers.",
  },
  nav: {
    home: "Home",
    jobs: "Jobs",
    trending: "GitHub Trending",
    hosting: "VPS Compare",
  },
  theme: {
    light: "Light",
    dark: "Dark",
    system: "System",
    toggle: "Toggle theme",
  },
  locale: {
    label: "Language",
    vi: "Tiếng Việt",
    en: "English",
  },
  footer: {
    text: "Tech Pulse — IT jobs, GitHub Trending & VPS comparison. Data from RemoteOK, GitHub API, and public pricing.",
  },
  home: {
    hero: {
      tagline: "Tech Pulse",
      title: "IT Jobs, GitHub Trending & VPS Comparison",
      description:
        "Remote jobs, hot GitHub repos, and VPS pricing — auto-synced and SEO-friendly.",
      ctaJobs: "Browse jobs",
      ctaTrending: "GitHub Trending",
      ctaHosting: "Compare VPS",
    },
    features: {
      jobs: {
        title: "IT Jobs",
        description: "Remote jobs from RemoteOK, filter by stack and search.",
      },
      trending: {
        title: "GitHub Trending",
        description: "Rising repos by language, synced via GitHub API.",
      },
      hosting: {
        title: "VPS Compare",
        description: "Pricing for DigitalOcean, Vultr, Hetzner, Contabo...",
      },
    },
    preview: {
      jobsTitle: "Latest jobs",
      trendingTitle: "Trending",
      hostingTitle: "Best VPS deals",
      viewAll: "View all →",
      compare: "Compare →",
    },
  },
  jobs: {
    metaTitle: "Remote IT Jobs",
    metaDescription: "Remote IT jobs from RemoteOK, filter by stack.",
    title: "IT Jobs",
    description: "Remote jobs synced from RemoteOK. Filter by tag or search.",
    searchPlaceholder: "Search title, company, tags...",
    search: "Search",
    all: "All",
    emptyTitle: "No jobs yet",
    emptyDescription: "Run sync via /api/cron/sync or wait for the cron job.",
    viewOriginal: "View original →",
    remote: "Remote",
    backToList: "← Back to jobs",
    salary: "Salary",
    location: "Location",
    posted: "Posted",
    source: "Source",
    apply: "Apply / View original",
    notFound: "Not found",
    detailDescription: "Job {title} at {company}. Tags: {tags}",
  },
  trending: {
    metaTitle: "GitHub Trending",
    metaDescription: "GitHub trending repos by language, updated weekly.",
    title: "GitHub Trending",
    description:
      "Repos created in the last 7 days, sorted by stars (GitHub Search API).",
    emptyTitle: "No trending repos",
    emptyDescription: "Add GITHUB_TOKEN to .env and call /api/cron/sync to sync.",
  },
  hosting: {
    metaTitle: "VPS / Hosting Comparison",
    metaDescription:
      "Compare VPS pricing for DigitalOcean, Vultr, Hetzner, Contabo by RAM and price.",
    title: "VPS Comparison",
    description:
      "Reference pricing from popular providers. Best $/GB RAM plans are highlighted.",
    compareTitle: "Comparison table ($/GB RAM)",
    disclaimer:
      "* Reference prices, may change. Check official sites before buying. Some links may become affiliate later.",
    all: "All",
    minRam: "Min RAM",
    maxPrice: "Max price",
    filter: "Filter",
    perMonth: "/mo",
    bandwidth: "bandwidth",
    viewOfficial: "View official pricing →",
    emptyTitle: "No matching plans",
    emptyDescription: "Try removing filters or browse all providers.",
    table: {
      provider: "Provider",
      plan: "Plan",
      ram: "RAM",
      vcpu: "vCPU",
      ssd: "SSD",
      price: "Price/mo",
      perGb: "$/GB RAM",
    },
  },
  time: {
    today: "Today",
    yesterday: "Yesterday",
    daysAgo: "{count} days ago",
    weeksAgo: "{count} weeks ago",
    monthsAgo: "{count} months ago",
  },
} satisfies Messages;
