import React from "react";

type Props = {
  text: string;
  className?: string;
};

const URL_RE = /(https?:\/\/[^\s]+)/g;

function renderInline(text: string) {
  const parts = text.split(URL_RE);
  return parts.map((part, index) => {
    if (URL_RE.test(part)) {
      return (
        <a
          key={`${part}-${index}`}
          href={part}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline underline-offset-2"
        >
          {part}
        </a>
      );
    }
    return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
  });
}

export function RichTextContent({ text, className }: Props) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className={className}>
      {blocks.map((block, index) => (
        <p key={`${index}-${block.slice(0, 24)}`} className="whitespace-pre-line">
          {renderInline(block)}
        </p>
      ))}
    </div>
  );
}
