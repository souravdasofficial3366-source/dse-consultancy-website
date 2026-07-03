import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sub Pages",
  description: "Starter area for future DSE Consultancy sub pages.",
  robots: {
    index: false,
    follow: false
  }
};

export default function SubPagesIndexPage() {
  return (
    <main>
      <section className="section white">
        <div className="container">
          <span className="eyebrow">Sub pages</span>
          <h1>Future sub pages</h1>
          <p className="section-copy">
            Use this section when you want to add extra pages that are not services, case studies,
            contact, or about pages.
          </p>
          <div className="service-grid">
            <article className="service-card">
              <span className="material-symbols-outlined service-icon">add_circle</span>
              <h2>Example sub page</h2>
              <p>Create a page like `/sub-pages/example-page` by editing the dynamic starter file.</p>
              <a className="outline-button" href="/sub-pages/example-page">
                Open example
              </a>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
