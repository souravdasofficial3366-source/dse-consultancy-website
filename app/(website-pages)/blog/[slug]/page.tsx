import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/data/blog";
import { BlogAiSummaryConsole } from "@/components/blog/BlogAiSummaryConsole";
import { siteConfig } from "@/data/site";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const articleUrl = `${siteConfig.siteUrl}/blog/${post.slug}`;
  const relatedPosts = blogPosts.filter((candidate) => candidate.slug !== post.slug).slice(0, 2);

  return (
    <main className={`dse-article-page ${post.accent}`}>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            author: { "@type": "Organization", name: post.author ?? "DSE Consultancy" },
            datePublished: post.publishedAt,
            mainEntityOfPage: articleUrl
          })
        }}
        type="application/ld+json"
      />
      <section className="dse-article-hero">
        <div className="container dse-article-hero-inner">
          <Link href="/blog">← Back To Insights</Link>
          <small>{post.category} · {post.displayDate} · {post.readingTime}</small>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <span className="dse-article-hero-art" aria-hidden="true"><i /><i /><b>DSE</b></span>
        </div>
      </section>

      <BlogAiSummaryConsole articleUrl={articleUrl} post={post} />

      <article className="dse-article-body">
        <div className="container dse-article-layout">
          <aside>
            <span>In This Article</span>
            {post.sections.map((section, index) => (
              <a href={`#section-${index + 1}`} key={section.heading}>{section.heading}</a>
            ))}
          </aside>
          <div className="dse-article-copy">
            {post.sections.map((section, index) => (
              <section id={`section-${index + 1}`} key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.points ? (
                  <ul>
                    {section.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                ) : null}
              </section>
            ))}
            <div className="dse-article-cta">
              <span>Need Help Applying This To Your Business?</span>
              <h2>
                <span>Turn The Advice Into A</span>
                <span>Practical Digital Plan.</span>
              </h2>
              <Link href="/contact-us">Talk To DSE Consultancy ↗</Link>
            </div>

            <section className="dse-article-related" aria-labelledby="related-articles-title">
              <span className="dse-article-ai-kicker">Continue Reading</span>
              <h2 id="related-articles-title">More Useful Insights.</h2>
              <div className="dse-article-related-grid">
                {relatedPosts.map((relatedPost) => (
                  <Link href={`/blog/${relatedPost.slug}`} key={relatedPost.slug}>
                    <small>{relatedPost.category} · {relatedPost.readingTime}</small>
                    <strong>{relatedPost.title}</strong>
                    <span>Read article ↗</span>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </article>
    </main>
  );
}
