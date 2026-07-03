"use client";

import { useId, useState } from "react";

export type FaqItem = {
  question: string;
  answer: string;
};

type FaqListProps = {
  items: FaqItem[];
};

export function FaqList({ items }: FaqListProps) {
  const [openIndex, setOpenIndex] = useState(0);
  const listId = useId();

  return (
    <div className="faq-list">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const number = String(index + 1).padStart(2, "0");
        const answerId = `${listId}-answer-${index}`;

        return (
          <article className={`faq-card ${isOpen ? "open" : ""}`} key={item.question}>
            <button
              aria-controls={answerId}
              aria-expanded={isOpen}
              className="faq-button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              type="button"
            >
              <span className="faq-title">
                <span className="faq-number">{number}</span>
                {item.question}
              </span>
              <span className="material-symbols-outlined">{isOpen ? "expand_less" : "expand_more"}</span>
            </button>
            {isOpen ? (
              <div className="faq-answer" id={answerId}>
                <p>{item.answer}</p>
                {index === 0 ? (
                  <div className="faq-actions">
                    <a className="primary-button" href="#lead-form">
                      Book a call
                    </a>
                    <a className="outline-button" href="#pricing">
                      See prices
                    </a>
                  </div>
                ) : null}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
