import type { MetadataRoute } from "next";

const BASE = "https://vergerfrancoislegault.ca";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/notre-verger",
    "/galerie",
    "/contact",
    "/politique-de-confidentialite",
  ];
  const now = new Date();
  return routes.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
