import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Digital Growth Insights",
  description:
    "Practical articles from DSE Consultancy about website development, social media management, SEO and local business visibility."
};

export default function BlogPage() {
  const [featuredPost, ...otherPosts] = blogPosts;

  return (
    <main className="dse-inner-page dse-blog-page">
      <section className="dse-blog-hero">
        <div className="container">
          <span className="consultancy-home-kicker">DSE Insights</span>
          <h1>
            <span>Ideas For A More Useful, Visible</span>
            <span>And Connected Digital Presence.</span>
          </h1>
          <p>
            Practical guidance for local businesses navigating websites, search, social media,
            content and customer enquiry journeys.
          </p>
        </div>
      </section>

      <section className="dse-blog-content">
        <div className="container">
          <Link className={`dse-blog-feature ${featuredPost.accent}`} href={`/blog/${featuredPost.slug}`}>
            <span className="dse-blog-feature-art" aria-hidden="true">
              <i /><i /><i /><b>01</b>
            </span>
            <span className="dse-blog-feature-copy">
              <small>{featuredPost.category} · {featuredPost.displayDate}</small>
              <strong>{featuredPost.title}</strong>
              <span>{featuredPost.excerpt}</span>
              <b>Read Article <i aria-hidden="true">↗</i></b>
            </span>
          </Link>

          <div className="dse-blog-toolbar">
            <h2>
              <span>Latest</span>
              <span>Articles</span>
            </h2>
            <span>Website Development · SMM + SEO · Local Visibility</span>
          </div>

          <div className="dse-blog-grid">
            {otherPosts.map((post, index) => (
              <Link className={`dse-blog-card ${post.accent}`} href={`/blog/${post.slug}`} key={post.slug}>
                <span className="dse-blog-card-art"><b>0{index + 2}</b><i /></span>
                <small>{post.category}</small>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <span className="dse-blog-card-meta">{post.displayDate} · {post.readingTime} <b>↗</b></span>
              </Link>
            ))}
          </div>

          <div className="dse-blog-publishing-note">
            <span className="material-symbols-outlined">edit_note</span>
            <div>
              <h2>
                <span>Ready for Ongoing</span>
                <span>Publishing and Updates</span>
              </h2>
              <p>
                New updates and articles can be added through the reusable blog data structure and
                will automatically appear on this page and receive their own article URL.
              </p>
            </div>
            <Link href="/contact-us">Suggest A Topic ↗</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
