import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ pageSlug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pageSlug } = await params;
  const title = pageSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title,
    description: `${title} page for DSE Consultancy.`,
    robots: {
      index: false,
      follow: false
    }
  };
}

export default async function SubPage({ params }: PageProps) {
  const { pageSlug } = await params;
  const title = pageSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <main>
      <section className="section white">
        <div className="container">
          <span className="eyebrow">Sub page</span>
          <h1>{title}</h1>
          <p className="section-copy">
            This is a starter sub page. You can replace this text with your own content.
          </p>
        </div>
      </section>
    </main>
  );
}
