import { fetchSitemapData, generateSitemapXml } from "@/lib/Sitemap";

export async function GET() {
  try {
    const data = await fetchSitemapData();
    const body = generateSitemapXml(data);

    return new Response(body, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response("Error generating sitemap", { status: 500 });
  }
}
