// generate-sitemap.js
import { SitemapStream, streamToPromise } from "sitemap";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// List your pages
const links = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/mock-interviews", changefreq: "weekly", priority: 0.9 },
  { url: "/ai-interview-prep", changefreq: "weekly", priority: 0.9 },
  { url: "/pricing", changefreq: "monthly", priority: 0.8 },
  { url: "/about", changefreq: "monthly", priority: 0.7 },
];

// Sitemap stream
const sitemap = new SitemapStream({ hostname: "https://interviewprepai.in" });
links.forEach((link) => sitemap.write(link));
sitemap.end();

// Convert to XML
const xml = await streamToPromise(sitemap).then((data) => data.toString());

// Ensure public folder exists
const publicDir = path.resolve("./public");
await mkdir(publicDir, { recursive: true });

// Write sitemap.xml in public folder
const sitemapPath = path.join(publicDir, "sitemap.xml");
await writeFile(sitemapPath, xml);

console.log("Sitemap generated at /public/sitemap.xml");
