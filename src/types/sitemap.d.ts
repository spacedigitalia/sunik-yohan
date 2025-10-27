type ChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

interface SitemapRoute {
  loc: string;
  lastmod: string;
  changefreq: ChangeFreq;
  priority: number;
}

interface SitemapData {
  generatedAt: string;
  baseUrl: string;
  routes: SitemapRoute[];
}
