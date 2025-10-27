const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/sitemap`;

export async function fetchSitemapData(): Promise<SitemapData> {
  try {
    const response = await fetch(API_URL, {
      next: {
        revalidate: 3600, // Revalidate every hour
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SitemapData = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching sitemap data from API:", error);
    throw error;
  }
}

export function generateSitemapXml(data: SitemapData): string {
  const routes = data.routes;

  const urlset = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route: SitemapRoute) => `  <url>
    <loc>${route.loc}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return urlset;
}
