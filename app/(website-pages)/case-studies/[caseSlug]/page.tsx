import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy } from "@/data/case-studies";

type PageProps = {
  params: Promise<{ caseSlug: string }>;
};

export function generateStaticParams() {
  return caseStudies.map((caseStudy) => ({ caseSlug: caseStudy.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { caseSlug } = await params;
  const caseStudy = getCaseStudy(caseSlug);

  if (!caseStudy) {
    return {};
  }

  return {
    title: caseStudy.title,
    description: caseStudy.summary
  };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { caseSlug } = await params;
  const caseStudy = getCaseStudy(caseSlug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <main>
      <section className="section white">
        <div className="container seo-content">
          <div>
            <span className="eyebrow">Case study</span>
            <h1>{caseStudy.title}</h1>
            <p className="section-copy">{caseStudy.summary}</p>
          </div>
          <aside className="seo-panel">
            <h2>Business details</h2>
            <p>Business type: {caseStudy.businessType}</p>
            <p>City: {caseStudy.city}</p>
            <p>{caseStudy.result}</p>
          </aside>
        </div>
      </section>
    </main>
  );
}
