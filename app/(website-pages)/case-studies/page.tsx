import type { Metadata } from "next";
import { caseStudies } from "@/data/case-studies";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Example small business website case pages from DSE Consultancy."
};

export default function CaseStudiesPage() {
  return (
    <main>
      <section className="section white">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Case studies</span>
            <h1>Example business website cases</h1>
            <p className="section-copy">
              Use this folder for future case pages and customer success stories.
            </p>
          </div>
          <div className="service-grid">
            {caseStudies.map((caseStudy) => (
              <article className="service-card" key={caseStudy.slug}>
                <span className="material-symbols-outlined service-icon">article</span>
                <h2>{caseStudy.title}</h2>
                <p>{caseStudy.summary}</p>
                <a className="outline-button" href={`/case-studies/${caseStudy.slug}`}>
                  Read case
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
