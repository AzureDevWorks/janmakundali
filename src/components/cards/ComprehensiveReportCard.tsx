import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { useAllPredictions } from '@/features/predictions/useAllPredictions';

export function ComprehensiveReportCard({ kundli }: { kundli: any }) {
  const { data, isLoading, error } = useAllPredictions(kundli);
  const [view, setView] = useState<'reading' | 'raw'>('reading');

  if (isLoading) {
    return <Card title="Comprehensive Report"><p className="text-sm text-muted-foreground">Building full multi-system reading…</p></Card>;
  }
  if (error || !data) return null;

  const md = data.formattedMarkdown ?? '';

  return (
    <Card
      title="Grand Multi-System Report"
      subtitle="Parashari · Jaimini · Chalit · KP · Lal Kitab"
      right={
        <div className="inline-flex overflow-hidden rounded-md border text-[10px]">
          <button onClick={() => setView('reading')}
            className={cn('px-2.5 py-1 font-semibold', view === 'reading' ? 'bg-amber-500 text-white' : 'hover:bg-amber-50')}>
            Reading
          </button>
          <button onClick={() => setView('raw')}
            className={cn('border-l px-2.5 py-1 font-semibold', view === 'raw' ? 'bg-amber-500 text-white' : 'hover:bg-amber-50')}>
            Raw
          </button>
        </div>
      }
      bodyClass="p-0"
    >
      {view === 'raw' ? (
        <pre className="max-h-[900px] overflow-auto bg-muted/40 p-4 text-[11px] leading-relaxed whitespace-pre-wrap">
          {md}
        </pre>
      ) : (
        <div className="max-h-[900px] overflow-auto px-6 py-6">
          <Markdown source={md} />
        </div>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ *
 * Markdown renderer
 * Handles: # / ## / ###, blockquote, bullets (with **bold** and
 * `code`), italics, bold, horizontal rules. Escapes HTML first.
 * ------------------------------------------------------------------ */

function Markdown({ source }: { source: string }) {
  if (!source) return <p className="text-sm text-muted-foreground">No report generated.</p>;

  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const out: React.ReactNode[] = [];
  let list: string[] = [];
  let listKey = 0;

  const flush = () => {
    if (list.length === 0) return;
    out.push(
      <ul key={'ul-' + (listKey++)} className="my-2 space-y-1.5">
        {list.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed">
            <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-amber-500" />
            <span dangerouslySetInnerHTML={{ __html: inline(item) }} />
          </li>
        ))}
      </ul>,
    );
    list = [];
  };

  lines.forEach((raw, i) => {
    const line = raw.trimEnd();

    // Headings
    if (line.startsWith('### ')) {
      flush();
      out.push(<h4 key={i} className="mt-5 mb-1.5 text-sm font-bold tracking-tight text-amber-800"
        dangerouslySetInnerHTML={{ __html: inline(line.slice(4)) }} />);
      return;
    }
    if (line.startsWith('## ')) {
      flush();
      out.push(<h3 key={i} className="mt-7 mb-2 border-b pb-1 text-base font-bold tracking-tight"
        dangerouslySetInnerHTML={{ __html: inline(line.slice(3)) }} />);
      return;
    }
    if (line.startsWith('# ')) {
      flush();
      out.push(<h2 key={i} className="mt-6 mb-3 text-xl font-bold tracking-tight text-amber-900"
        dangerouslySetInnerHTML={{ __html: inline(line.slice(2)) }} />);
      return;
    }

    // Horizontal rule
    if (/^---+$/.test(line)) {
      flush();
      out.push(<hr key={i} className="my-4 border-t" />);
      return;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      flush();
      out.push(
        <blockquote key={i} className="my-3 border-l-4 border-amber-400 bg-amber-50/50 py-2 pl-4 pr-2 text-sm italic leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: inline(line.slice(2)) }} />
        </blockquote>,
      );
      return;
    }

    // Bullet list item
    if (/^\s*[-*]\s+/.test(line)) {
      list.push(line.replace(/^\s*[-*]\s+/, ''));
      return;
    }

    // Blank line
    if (line.trim() === '') {
      flush();
      return;
    }

    // Regular paragraph
    flush();
    out.push(
      <p key={i} className="my-1.5 text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: inline(line) }} />,
    );
  });

  flush();
  return <div className="space-y-1">{out}</div>;
}

/** Inline markdown: escape HTML, then convert **bold**, *italic*, `code`. */
function inline(s: string): string {
  // 1. Escape raw HTML — must happen first
  let out = s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 2. Inline code — protect from further parsing by using a placeholder
  const codeStore: string[] = [];
  out = out.replace(/`([^`]+)`/g, (_, inner) => {
    codeStore.push(inner);
    return '\u0000CODE' + (codeStore.length - 1) + '\u0000';
  });

  // 3. Bold **text**
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // 4. Italic *text* (only when not part of **)
  out = out.replace(/(^|[^*])\*([^*\n]+?)\*([^*]|$)/g, '$1<em>$2</em>$3');

  // 5. Restore code
  out = out.replace(/\u0000CODE(\d+)\u0000/g, (_, i) =>
    '<code class="rounded bg-amber-100 px-1 py-0.5 font-mono text-[0.9em] text-amber-900">' +
    codeStore[Number(i)] +
    '</code>');

  return out;
}