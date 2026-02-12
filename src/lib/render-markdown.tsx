import { type ReactNode } from 'react';

function processInlineFormatting(line: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let remaining = line;
  let partKey = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) {
        parts.push(
          <span key={`text-${partKey++}`}>{remaining.slice(0, boldMatch.index)}</span>
        );
      }
      parts.push(
        <span key={`bold-${partKey++}`} className="text-emerald-400 font-semibold">
          {boldMatch[1]}
        </span>
      );
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
    } else {
      parts.push(<span key={`text-${partKey++}`}>{remaining}</span>);
      break;
    }
  }

  return parts;
}

export function renderMarkdown(text: string): ReactNode[] {
  const lines = text.split('\n');
  const elements: ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${key++}`} className="list-disc list-inside space-y-2 mb-4">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-white/80">{processInlineFormatting(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line) => {
    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={`h2-${key++}`} className="text-xl font-semibold text-purple-400 mb-3 mt-6">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={`h3-${key++}`} className="text-lg font-semibold text-white mb-2 mt-4">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('- ')) {
      listItems.push(line.slice(2));
    } else if (line.trim() === '') {
      flushList();
    } else {
      flushList();
      elements.push(
        <p key={`p-${key++}`} className="text-white/80 mb-3">
          {processInlineFormatting(line)}
        </p>
      );
    }
  });

  flushList();
  return elements;
}
