import { getMangasSitemap } from '../actions/manga';
import { DOMAIN } from "../config";
export const runtime = 'experimental-edge';

const generateXmlSitemap = (blogs) => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${DOMAIN}</loc>
      <priority>1.0</priority>
      <changefreq>daily</changefreq>
    </url>`;

  blogs.forEach((blog) => {
    xml += `
    <url>
      <loc>${`${DOMAIN}/manga/${blog.slug}`}</loc>
      <lastmod>${blog.createdAt}</lastmod>
    </url>`;
  });

  xml += '</urlset>';
  return xml;
};


export async function getServerSideProps({ res }) {
  const blogs = await getMangasSitemap();
  res.setHeader('Content-Type', 'text/xml');
  res.write(generateXmlSitemap(blogs.mangas));
  res.end();

  return { props: {} };
}

export default generateXmlSitemap;