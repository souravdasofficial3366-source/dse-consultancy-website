import type { CSSProperties } from "react";

type Tool = {
  name: string;
  category: string;
  icon?: string;
  fallback?: string;
  accent: string;
};

const toolRows: Tool[][] = [
  [
    { name: "Adobe", category: "Creative", fallback: "A", accent: "#e5332a" },
    { name: "Google Workspace", category: "Collaboration", fallback: "GW", accent: "#4285f4" },
    { name: "Canva", category: "Creative", icon: "/logos/tools/canva.svg", accent: "#7d2ae8" },
    { name: "Figma", category: "Design", icon: "/logos/tools/figma.svg", accent: "#f24e1e" },
    { name: "Google Stitch", category: "UI creation", icon: "/logos/tools/google-stitch.svg", accent: "#4285f4" },
    { name: "OpenAI", category: "AI", icon: "/logos/tools/openai.svg", accent: "#10a37f" },
    { name: "Zapier", category: "Automation", icon: "/logos/tools/zapier.svg", accent: "#ff4f00" },
    { name: "Make", category: "Automation", icon: "/logos/tools/make.svg", accent: "#6d00cc" },
    { name: "Notion", category: "Planning", icon: "/logos/tools/notion.svg", accent: "#111111" },
    { name: "Slack", category: "Collaboration", icon: "/logos/tools/slack.svg", accent: "#611f69" },
    { name: "Trello", category: "Planning", icon: "/logos/tools/trello.svg", accent: "#0052cc" },
    { name: "Airtable", category: "Operations", icon: "/logos/tools/airtable.svg", accent: "#18bfff" },
    { name: "Asana", category: "Planning", icon: "/logos/tools/asana.svg", accent: "#f06a6a" },
    { name: "Calendly", category: "Scheduling", icon: "/logos/tools/calendly.svg", accent: "#006bff" },
    { name: "HubSpot", category: "CRM", icon: "/logos/tools/hubspot.svg", accent: "#ff7a59" },
    { name: "Mailchimp", category: "Email", icon: "/logos/tools/mailchimp.svg", accent: "#ffe01b" },
    { name: "Brevo", category: "Email", icon: "/logos/tools/brevo.svg", accent: "#0b996e" }
  ],
  [
    { name: "Meta", category: "Social", icon: "/logos/tools/meta.svg", accent: "#0866ff" },
    { name: "Instagram", category: "Social", icon: "/logos/tools/instagram.svg", accent: "#e1306c" },
    { name: "Facebook", category: "Social", icon: "/logos/tools/facebook.svg", accent: "#1877f2" },
    { name: "LinkedIn", category: "Social", fallback: "in", accent: "#0a66c2" },
    { name: "YouTube", category: "Video", icon: "/logos/tools/youtube.svg", accent: "#ff0000" },
    { name: "Buffer", category: "Publishing", icon: "/logos/tools/buffer.svg", accent: "#168eea" },
    { name: "Hootsuite", category: "Publishing", icon: "/logos/tools/hootsuite.svg", accent: "#143059" },
    { name: "Google Analytics", category: "Analytics", icon: "/logos/tools/google-analytics.svg", accent: "#e37400" },
    { name: "Search Console", category: "SEO", icon: "/logos/tools/google-search-console.svg", accent: "#4285f4" },
    { name: "Google Ads", category: "Advertising", icon: "/logos/tools/google-ads.svg", accent: "#4285f4" },
    { name: "Tag Manager", category: "Tracking", icon: "/logos/tools/google-tag-manager.svg", accent: "#246fdb" },
    { name: "Looker Studio", category: "Reporting", icon: "/logos/tools/looker.svg", accent: "#4285f4" },
    { name: "Semrush", category: "SEO", icon: "/logos/tools/semrush.svg", accent: "#ff642d" },
    { name: "Ahrefs", category: "SEO", fallback: "Ah", accent: "#ff8800" },
    { name: "Hotjar", category: "Insights", icon: "/logos/tools/hotjar.svg", accent: "#fd3a5c" },
    { name: "WordPress", category: "Web", icon: "/logos/tools/wordpress.svg", accent: "#21759b" },
    { name: "Shopify", category: "Commerce", icon: "/logos/tools/shopify.svg", accent: "#7ab55c" }
  ]
];

function ToolTile({ tool }: { tool: Tool }) {
  return (
    <article className="social-tool-logo-card" style={{ "--tool-accent": tool.accent } as CSSProperties} tabIndex={0}>
      <span className="social-tool-logo-mark">
        {tool.icon ? <img alt="" aria-hidden="true" src={tool.icon} /> : <strong>{tool.fallback}</strong>}
      </span>
      <span>
        <strong>{tool.name}</strong>
        <small>{tool.category}</small>
      </span>
    </article>
  );
}

export function ToolLogoCarousel() {
  return (
    <div className="social-tool-carousel" aria-label="Tools and platforms used across DSE Consultancy projects">
      {toolRows.map((tools, rowIndex) => (
        <div className={`social-tool-row row-${rowIndex + 1}`} key={rowIndex}>
          <div className="social-tool-track">
            {[...tools, ...tools].map((tool, index) => (
              <ToolTile key={`${tool.name}-${index}`} tool={tool} />
            ))}
          </div>
        </div>
      ))}
      <p>Platforms are selected according to each project. All trademarks belong to their respective owners.</p>
    </div>
  );
}
