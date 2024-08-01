import { getMangasSitemap } from "@/actions/manga";
import { DOMAIN } from "@/config";
export const runtime = 'experimental-edge';

const generateSiteMap = (data) => {
  const posts = [];
  for (const i in data) { posts.push(data[i]); }

  const date = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">

    <url>
      <loc>${DOMAIN}</loc>
      <lastmod>${date}</lastmod>
    </url>

    ${posts && posts.map(item => {
    return `<url>
        <loc>${DOMAIN}/manga/${item.slug}</loc>
        <lastmod>${item.createdAt}</lastmod>
      </url>`;
  }).join('')}
  </urlset>
  `;
};

function SiteMap() { }

export const getServerSideProps = async ({ res }) => {
  const request = await getMangasSitemap();
  const data = await request.mangas;
  const sitemap = generateSiteMap(data);
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=10800, stale-while-revalidate=59');
  res.write(sitemap);
  res.end();
  return { props: {} };
};

export default SiteMap;