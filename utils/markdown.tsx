import React from "react";

/**
 * A simple, safe markdown renderer to parse explanation texts, code blocks, 
 * bold text, bullet items, and headers into JSX elements.
 */
export function parseMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];

  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let codeLang = "";
  let listItems: string[] = [];
  let inList = false;

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key} className="list-disc pl-6 my-3 space-y-1.5 text-zinc-700 dark:text-zinc-300">
          {listItems.map((item, i) => (
            <li key={i} className="text-sm">
              {parseInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block check
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // Close code block
        inCodeBlock = false;
        elements.push(
          <pre
            key={`code-${i}`}
            className="bg-zinc-950 text-zinc-100 rounded-lg p-4 font-mono text-xs overflow-x-auto border border-zinc-800 my-4"
          >
            {codeLang && <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-2">{codeLang}</div>}
            <code>{codeContent.join("\n")}</code>
          </pre>
        );
        codeContent = [];
        codeLang = "";
      } else {
        // Open code block
        inCodeBlock = true;
        codeLang = line.trim().substring(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    // Unordered List parsing
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      inList = true;
      listItems.push(line.trim().substring(2));
      continue;
    } else {
      if (inList) {
        flushList(`list-${i}`);
      }
    }

    // Header checks
    if (line.trim().startsWith("### ")) {
      elements.push(
        <h4 key={i} className="text-base font-bold text-zinc-900 dark:text-zinc-50 mt-6 mb-2">
          {parseInlineMarkdown(line.trim().substring(4))}
        </h4>
      );
      continue;
    }

    if (line.trim().startsWith("## ")) {
      elements.push(
        <h3 key={i} className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50 mt-8 mb-3 border-b border-zinc-150 dark:border-zinc-800 pb-1">
          {parseInlineMarkdown(line.trim().substring(3))}
        </h3>
      );
      continue;
    }

    if (line.trim().startsWith("# ")) {
      elements.push(
        <h2 key={i} className="text-2xl font-black text-zinc-900 dark:text-zinc-50 mt-10 mb-4">
          {parseInlineMarkdown(line.trim().substring(2))}
        </h2>
      );
      continue;
    }

    // Horizontal Rule
    if (line.trim() === "---" || line.trim() === "***") {
      elements.push(<hr key={i} className="border-zinc-200 dark:border-zinc-850 my-6" />);
      continue;
    }

    // Default Paragraph text
    if (line.trim() !== "") {
      elements.push(
        <p key={i} className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-350 my-3">
          {parseInlineMarkdown(line)}
        </p>
      );
    }
  }

  // Flush remaining lists if any
  if (inList) {
    flushList(`list-end`);
  }

  return elements;
}

/**
 * Parse inline bold (**bold**) and inline code (`code`) structures.
 */
function parseInlineMarkdown(text: string): React.ReactNode {
  // Simple regex splits to format inline codes `foo` and bold **bar**
  const boldRegex = /\*\*(.*?)\*\*/g;
  const codeRegex = /`(.*?)`/g;

  let parts: React.ReactNode[] = [text];

  // 1. Process Bold text
  parts = parts.flatMap((part) => {
    if (typeof part !== "string") return part;
    const split = part.split(boldRegex);
    return split.map((str, idx) => (idx % 2 === 1 ? <strong key={`b-${idx}`} className="font-bold text-zinc-900 dark:text-zinc-50">{str}</strong> : str));
  });

  // 2. Process Inline code
  parts = parts.flatMap((part) => {
    if (typeof part !== "string") return part;
    const split = part.split(codeRegex);
    return split.map((str, idx) => (idx % 2 === 1 ? <code key={`c-${idx}`} className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs font-mono text-pink-600 dark:text-pink-400">{str}</code> : str));
  });

  return <>{parts}</>;
}
