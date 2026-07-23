export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqActions = {
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
};

export const homeFaqs = [
  {
    question:
      "Where should a small business start if its website, Google profile and social pages are not working together?",
    answer:
      "Start with the point that is stopping customers from finding, trusting or contacting the business. DSE Consultancy reviews the current website, Google presence, social activity and enquiry path, then recommends the most useful first step instead of forcing every service into one package."
  },
  {
    question:
      "Can DSE Consultancy improve an existing digital presence without rebuilding everything?",
    answer:
      "Yes. If an existing website, Google Business Profile or social account is useful, we can improve and connect it instead of replacing it without reason. The scope is based on what can be retained, what is blocking results and what customers need next."
  },
  {
    question:
      "How will we know whether the work is generating real enquiries rather than only views?",
    answer:
      "We focus on useful actions such as calls, WhatsApp clicks, form submissions, direction requests and qualified conversations. Reports should explain what changed, which actions customers took and what should be improved next."
  },
  {
    question:
      "Will website, local SEO and social work create overlapping or hidden charges?",
    answer:
      "The proposed scope separates shared work from service-specific work before payment. If two services use the same content, tracking or business information, the quotation should explain that connection clearly instead of charging for the same task twice."
  }
] as const satisfies readonly FaqItem[];

export const aboutFaqs = [
  {
    question:
      "How does DSE Consultancy avoid giving every business the same generic package?",
    answer:
      "We first review the business, location, customers, current digital assets and the action that should create an enquiry. Packages provide a clear starting structure, but the recommended scope is adjusted around the real requirement."
  },
  {
    question: "How are scope, timelines and extra costs explained before work begins?",
    answer:
      "The quotation should state the agreed pages, features, content responsibilities, approval stages, delivery range and recurring costs. Work outside that scope is discussed and approved before it is added."
  },
  {
    question: "Who owns the website, content and business accounts after delivery?",
    answer:
      "The client should keep ownership or administrator access to the domain, website, content and core business accounts. DSE Consultancy uses the access needed to complete the work and avoids creating unnecessary long-term dependency."
  },
  {
    question:
      "What happens if the recommended service is not the right fit for the business?",
    answer:
      "We explain the limitation and recommend a smaller, different or later step where appropriate. A service should solve a clear business problem; it should not be sold only because it is available."
  }
] as const satisfies readonly FaqItem[];

export const contactFaqs = [
  {
    question: "Can DSE Consultancy manage local SEO and website development in West Bengal?",
    answer:
      "Yes. DSE Consultancy supports businesses across West Bengal with local SEO, Google Business Profile optimisation, mobile-first website development, location-focused service pages and enquiry tracking. We recommend the scope after reviewing the business location, service area, competition, customer search behaviour and the enquiries the business wants to generate."
  },
  {
    question:
      "What information should I share to receive an accurate recommendation or quote?",
    answer:
      "Share the business type, location, main services, current website or profile links, the problem you want to solve and the action customers should take. This helps us recommend a realistic scope instead of guessing from a package name."
  },
  {
    question:
      "Can I contact DSE Consultancy if I am unsure which service or package I need?",
    answer:
      "Yes. The Contact form does not force you to choose a package. We first understand whether the priority is a website, local visibility, social activity, lead collection or a connected plan."
  },
  {
    question: "What happens after I submit the Contact form?",
    answer:
      "Your enquiry is delivered to DSE Consultancy for review, and the team contacts you using the details you provided. The first conversation is used to understand the requirement, explain the next step and identify any information needed for a quotation."
  }
] as const satisfies readonly FaqItem[];

export const servicesFaqs = [
  {
    question: "Which digital service should a business fix first?",
    answer:
      "Fix the stage where customers are being lost. That may be discovery on Google, trust on the website or social pages, or the final enquiry path. DSE Consultancy reviews the current journey before recommending the first service."
  },
  {
    question: "Will I be charged twice if two services need some of the same work?",
    answer:
      "Shared work should be identified in the scope. Business information, messages, tracking and selected content can support more than one service, so the quotation should show where work is reused and where separate delivery is genuinely needed."
  },
  {
    question: "Can I start with one service and add another later?",
    answer:
      "Yes. A business can begin with the most urgent service and add another when the first foundation is ready. The work should be structured so future services can connect without rebuilding everything."
  },
  {
    question:
      "What should I confirm before choosing any website or digital marketing agency?",
    answer:
      "Confirm the written scope, delivery stages, account ownership, content responsibilities, recurring charges, reporting method and what support is included after launch. Avoid promises that depend on guaranteed rankings, fake reviews or unclear shortcuts."
  }
] as const satisfies readonly FaqItem[];

export const websiteDevelopmentFaqs = [
  {
    question:
      "How does DSE Consultancy prevent a website project from dragging on or being left unfinished?",
    answer:
      "The project is divided into clear content, design, build, review and launch stages. Responsibilities and approval points are agreed early, so missing content or delayed decisions can be identified before they stop the entire project."
  },
  {
    question: "What will I receive, and what could cost extra, before development begins?",
    answer:
      "The quotation explains the included pages, features, forms, content support, hosting or domain items, maintenance period and delivery scope. Extra pages, paid tools, special integrations or work outside the agreed scope are discussed before being added."
  },
  {
    question: "Will I own the domain, website access and content after launch?",
    answer:
      "Yes. The client should retain ownership or administrator access to the domain, website and business content. Any access DSE Consultancy uses for delivery should be documented and handed over clearly."
  },
  {
    question: "Who handles maintenance, updates and technical problems after launch?",
    answer:
      "The selected package explains the included maintenance period and support. Before that period ends, we clarify which updates are included, what needs a separate quotation and what access the client keeps for future work."
  },
  {
    question: "Is the starting price the final price for every website?",
    answer:
      "No. The displayed starting price covers the listed Essential scope. The final quotation depends on the required pages, features, content, integrations and ongoing support, and those additions are explained before payment."
  }
] as const satisfies readonly FaqItem[];

export const socialSeoFaqs = [
  {
    question: "Can any agency genuinely guarantee a first-page Google ranking?",
    answer:
      "No responsible agency can control Google well enough to guarantee a fixed ranking. DSE Consultancy improves relevant content, local signals, profile quality and technical foundations, then reports progress without promising a position that cannot be controlled."
  },
  {
    question:
      "Does DSE Consultancy use fake reviews or risky shortcuts to improve local visibility?",
    answer:
      "No. We can help create honest review-request steps and useful reply drafts, but we do not create fake reviews or recommend misleading activity. Shortcuts can damage customer trust and may put a Google Business Profile at risk."
  },
  {
    question: "What will the monthly report show besides followers, reach and impressions?",
    answer:
      "The report should connect visibility and content activity with useful actions such as calls, WhatsApp clicks, profile actions, direction requests, form submissions and qualified enquiries where tracking is available."
  },
  {
    question: "Who approves social content before it is published?",
    answer:
      "The approval workflow is agreed before regular posting begins. DSE Consultancy prepares the planned content, the client reviews business facts and offers, and publishing follows the agreed approval process."
  },
  {
    question:
      "Will DSE Consultancy need ownership of my social and Google Business accounts?",
    answer:
      "No. The client should keep ownership of the business accounts. DSE Consultancy only needs the appropriate role or access level to complete approved work, and that access can be reviewed or removed when the service ends."
  },
  {
    question: "Are paid-ad costs included in the monthly package?",
    answer:
      "No. The listed packages cover organic social media management and local SEO work. Advertising budget, paid campaign management and sponsored distribution are quoted separately when needed."
  }
] as const satisfies readonly FaqItem[];
