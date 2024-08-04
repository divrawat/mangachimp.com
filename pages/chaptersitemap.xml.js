import { getChapterSitemap } from "@/actions/chapter";
import { DOMAIN } from "../config";
import slugify from 'slugify';
// export const runtime = 'experimental-edge';

const generateXmlSitemap = (blogs) => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${DOMAIN}</loc>
      <priority>1.0</priority>
      <changefreq>daily</changefreq>
    </url>`;

  blogs.forEach((blog) => {
    const slugifiedName = slugify(blog.manganame).toLocaleLowerCase();
    xml += `
    <url>
      <loc>${`${DOMAIN}/manga/${slugifiedName}/chapter-${blog.chapterNumber}`}</loc>
      <lastmod>${blog.createdAt}</lastmod>
    </url>`;
  });

  xml += '</urlset>';
  return xml;
};


export async function getServerSideProps({ res }) {
  const blogs = await getChapterSitemap();
  res.setHeader('Content-Type', 'text/xml');
  res.write(generateXmlSitemap(blogs.chapters));
  res.end();

  return { props: {} };
}

export default generateXmlSitemap;