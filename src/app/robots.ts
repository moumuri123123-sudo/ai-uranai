import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/share/", "/history"],
      },
    ],
    sitemap: "https://uranaidokoro.com/sitemap.xml",
    host: "https://uranaidokoro.com",
  };
}
