export type Job = {
  id: string;
  slug: string;
  title: string;
  company: string;
  location: string | null;
  remote: boolean;
  tags: string[];
  salary: string | null;
  url: string;
  source: string;
  postedAt: string | null;
};

export type TrendingRepo = {
  id: string;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
  ownerAvatar: string | null;
  period: string;
  syncedAt: string;
};

export type HostingPlan = {
  id: string;
  provider: string;
  providerSlug: string;
  name: string;
  ramGb: number;
  cpuCores: number;
  storageGb: number;
  bandwidthTb: number | null;
  priceMonthlyUsd: number;
  region: string;
  affiliateUrl: string | null;
  features: string[];
};

export type SyncResult = {
  jobs: number;
  trending: number;
  hosting: number;
};
