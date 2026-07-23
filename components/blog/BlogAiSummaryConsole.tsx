"use client";

import type { BlogPost } from "@/data/blog";
import {
  buildArticlePrompt,
  getAssistantLabel,
  getAssistantUrl,
  type BlogAssistant
} from "@/lib/blog-ai";
import { useState } from "react";

const assistants: BlogAssistant[] = ["chatgpt", "claude", "gemini", "perplexity", "grok"];

type BlogAiSummaryConsoleProps = {
  post: BlogPost;
  articleUrl: string;
};

export function BlogAiSummaryConsole({ post, articleUrl }: BlogAiSummaryConsoleProps) {
  const prompt = buildArticlePrompt(post, articleUrl);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }

    window.setTimeout(() => setCopyState("idle"), 2200);
  }

  return (
    <section aria-labelledby="ai-summary-title" className="dse-article-ai">
      <div className="container">
        <div className="dse-article-glance" aria-label="Article details">
          <span>{post.category}</span>
          <span>{post.displayDate}</span>
          <span>{post.readingTime}</span>
          <span>{post.audience}</span>
        </div>

        <div className="dse-article-ai-grid">
          <div className="dse-article-ai-copy">
            <span className="dse-article-ai-kicker">Need A Quick Summary?</span>
            <h2 id="ai-summary-title">Ask Your Preferred AI Assistant.</h2>
            <p>
              Choose an assistant to open a new tab with this article URL and a ready-to-send
              prompt. You can review or edit it before sending.
            </p>
            <div className="dse-article-ai-source">
              <span>Source article</span>
              <code>{articleUrl}</code>
            </div>
          </div>

          <div className="dse-article-ai-takeaways">
            <span className="dse-article-ai-kicker">Key Takeaways</span>
            <ul>
              {(post.keyTakeaways ?? []).map((takeaway) => <li key={takeaway}>{takeaway}</li>)}
            </ul>
          </div>
        </div>

        <div className="dse-article-ai-actions" aria-label="AI summary assistants">
          {assistants.map((assistant) => (
            <a
              className={`dse-article-ai-button ${assistant}`}
              href={getAssistantUrl(assistant, prompt)}
              key={assistant}
              rel="noopener noreferrer"
              target="_blank"
              aria-label={`Open ${getAssistantLabel(assistant)} with a summary prompt in a new tab`}
            >
              <span>{getAssistantLabel(assistant)}</span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </div>

        <details className="dse-article-ai-fallback">
          <summary>Prefer to paste the prompt yourself?</summary>
          <div>
            <textarea aria-label="AI summary prompt" readOnly value={prompt} />
            <button type="button" onClick={copyPrompt}>
              {copyState === "copied" ? "Prompt Copied" : copyState === "failed" ? "Select And Copy" : "Copy Prompt"}
            </button>
          </div>
        </details>
      </div>
    </section>
  );
}
