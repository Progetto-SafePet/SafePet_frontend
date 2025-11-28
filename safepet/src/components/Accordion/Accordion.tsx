import { useRef, useState, useEffect } from "react";
import "./Accordion.scss";

export type AccordionItem = {
  question: string;
  answer: string;
};

type Props = {
  items: AccordionItem[];
};

export default function Accordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const bodyRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    bodyRefs.current.forEach((body, i) => {
      if (!body) return;
      if (openIndex === i) {
        body.style.maxHeight = body.scrollHeight + "px";
      } else {
        body.style.maxHeight = "0px";
      }
    });
  }, [openIndex]);

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-list">
          {items.map((faq, i) => {
            const isOpen = openIndex === i;

            return (
              <article
                key={i}
                className={`faq-item ${isOpen ? "is-open" : ""}`}
              >
                <button
                  className="faq-header"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-trigger-${i}`}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span className="faq-question">{faq.question}</span>
                  <span className="faq-icon" aria-hidden="true"></span>
                </button>

                <div
                  className="faq-body"
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  ref={(el) => (bodyRefs.current[i] = el)}
                >
                  <p>{faq.answer}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  );
}
