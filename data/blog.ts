export type BlogSection = {
  heading: string;
  paragraphs: string[];
  points?: string[];
};

export type BlogPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  displayDate: string;
  readingTime: string;
  accent: "blue" | "violet" | "coral";
  sections: BlogSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "website-checklist-for-local-businesses",
    category: "Website Development",
    title: "The Website Checklist Every Local Business Should Use",
    excerpt:
      "A practical checklist for turning a business website into a clear path from local search to phone call, WhatsApp message, or enquiry.",
    publishedAt: "2026-07-14",
    displayDate: "14 July 2026",
    readingTime: "6 min read",
    accent: "blue",
    sections: [
      {
        heading: "Start With The Customer's Question",
        paragraphs: [
          "Most visitors arrive with three questions: what do you offer, where do you serve, and how can they contact you? The first screen should answer all three without making the visitor search through the page.",
          "Use one clear headline, a short supporting sentence, and visible call or WhatsApp actions. Good design should make the next step obvious."
        ]
      },
      {
        heading: "Build The Essential Pages",
        paragraphs: [
          "A small business rarely needs dozens of pages at launch. It needs a focused set of pages that explains the business properly and gives search engines enough context."
        ],
        points: [
          "A focused homepage",
          "A clear services page",
          "An About page that builds confidence",
          "A Contact page with location and direct actions",
          "Useful articles that answer customer questions"
        ]
      },
      {
        heading: "Check The Mobile Experience",
        paragraphs: [
          "Test every form, button, menu, and phone link on a real mobile screen. Text should remain readable, forms should be short, and the most important contact action should always be easy to reach."
        ]
      }
    ]
  },
  {
    slug: "how-social-media-and-seo-work-together",
    category: "SMM + SEO",
    title: "How Social Media And SEO Work Together For Local Growth",
    excerpt:
      "Search creates discovery, social media builds familiarity, and a connected enquiry path helps turn that attention into business conversations.",
    publishedAt: "2026-07-10",
    displayDate: "10 July 2026",
    readingTime: "7 min read",
    accent: "violet",
    sections: [
      {
        heading: "Visibility Is Only The First Step",
        paragraphs: [
          "Appearing in search helps a customer discover your business. Current posts, helpful information, reviews, and consistent branding then help that customer decide whether the business feels active and dependable."
        ]
      },
      {
        heading: "Use One Message Across Every Channel",
        paragraphs: [
          "Your Google profile, website, Instagram, Facebook, and WhatsApp journey should describe the same services in the same clear language. This consistency reduces doubt and makes the business easier to remember."
        ],
        points: [
          "Keep business details consistent",
          "Turn common questions into posts and articles",
          "Link every channel to a useful next step",
          "Review enquiries instead of counting likes alone"
        ]
      },
      {
        heading: "Measure Signals That Matter",
        paragraphs: [
          "Track calls, direction requests, WhatsApp clicks, form submissions, profile visits, and useful search queries. These signals show whether visibility is creating genuine customer intent."
        ]
      }
    ]
  },
  {
    slug: "google-business-profile-weekly-routine",
    category: "Local Visibility",
    title: "A Simple Weekly Google Business Profile Routine",
    excerpt:
      "Small, consistent updates can keep business information useful, strengthen trust, and make it easier for nearby customers to take action.",
    publishedAt: "2026-07-06",
    displayDate: "6 July 2026",
    readingTime: "5 min read",
    accent: "coral",
    sections: [
      {
        heading: "Keep The Profile Accurate",
        paragraphs: [
          "Check opening hours, phone numbers, service areas, categories, and website links. Incorrect information creates friction at the exact moment a customer is ready to contact the business."
        ]
      },
      {
        heading: "Show Recent Business Activity",
        paragraphs: [
          "Add useful photos, publish a short update, and answer new questions. Recent activity helps customers understand what is available now rather than relying on old information."
        ],
        points: [
          "Check business details",
          "Upload one useful photo",
          "Publish one relevant update",
          "Respond to reviews professionally",
          "Review calls, clicks, and direction requests"
        ]
      },
      {
        heading: "Connect The Profile To The Website",
        paragraphs: [
          "Link customers to a page that matches what they searched for. A focused service page usually creates a clearer experience than sending every visitor to a general homepage."
        ]
      }
    ]
  }
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
