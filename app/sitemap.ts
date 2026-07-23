import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { caseStudies } from "@/data/case-studies";
import { getLocalSeoSlugs } from "@/data/local-seo";
import { services } from "@/data/services";
import { siteConfig } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = [
    "/about-us",
    "/contact-us",
    "/website-development",
    "/blog",
    "/privacy-policy",
    "/terms-and-conditions",
    "/services",
    "/case-studies",
    "/social-media-management-plus-seo"
  ];
  const servicePages = services.map((service) => `/services/${service.slug}`);
  const casePages = caseStudies.map((caseStudy) => `/case-studies/${caseStudy.slug}`);
  const blogPages = blogPosts.map((post) => `/blog/${post.slug}`);

  return [
    {
      url: siteConfig.siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1
    },
    ...staticPages.map((page) => ({
      url: `${siteConfig.siteUrl}${page}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75
    })),
    ...servicePages.map((page) => ({
      url: `${siteConfig.siteUrl}${page}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.72
    })),
    ...casePages.map((page) => ({
      url: `${siteConfig.siteUrl}${page}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.65
    })),
    ...blogPages.map((page) => ({
      url: `${siteConfig.siteUrl}${page}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7
    })),
    ...getLocalSeoSlugs().map((slug) => ({
      url: `${siteConfig.siteUrl}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}
