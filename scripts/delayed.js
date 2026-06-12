import { loadScript } from './aem.js';

const MERMAID_KEYWORDS = [
  'flowchart', 'sequenceDiagram', 'graph ', 'gantt', 'classDiagram',
  'stateDiagram', 'erDiagram', 'journey', 'gitGraph', 'mindmap', 'timeline',
];

// Statement-starting tokens for sequence/flowchart diagrams. A source line that
// does not begin with one of these (and has no edge arrow before its label) is
// treated as a wrapped continuation of the previous Note/message line.
const MERMAID_STATEMENT_TOKENS = [
  'sequenceDiagram', 'flowchart', 'graph', 'gantt', 'classDiagram',
  'stateDiagram', 'stateDiagram-v2', 'erDiagram', 'journey', 'gitGraph',
  'mindmap', 'timeline', 'Note', 'note', 'participant', 'actor', 'loop',
  'alt', 'else', 'opt', 'par', 'and', 'rect', 'end', 'activate',
  'deactivate', 'autonumber', 'title', 'section', 'subgraph', 'link',
  'class', 'click', 'style', 'box', 'critical', 'break',
];

const MERMAID_EDGE = /(--?>>?|--?[)x]|<<-->>|::)/;

function isMermaidStatement(line) {
  const trimmed = line.trim();
  if (trimmed === '') return true;
  const firstToken = trimmed.split(/[\s:]/)[0];
  if (MERMAID_STATEMENT_TOKENS.includes(firstToken)) return true;
  const colon = trimmed.indexOf(':');
  const head = colon === -1 ? trimmed : trimmed.slice(0, colon);
  if (MERMAID_EDGE.test(head)) return true;
  return /-->/.test(trimmed) || /---/.test(trimmed);
}

// Mermaid requires each Note and message label to live on a single line; authored
// content frequently wraps long labels across lines. Re-join those wrapped lines
// into the preceding statement with an HTML break, and normalize en/em dashes
// which mermaid 10 rejects outside of quoted labels.
function normalizeMermaid(text) {
  const dashFixed = text.replaceAll('\u2014', '-').replaceAll('\u2013', '-');
  const merged = [];
  dashFixed.split('\n').forEach((line) => {
    if (merged.length && line.trim() !== '' && !isMermaidStatement(line)) {
      merged[merged.length - 1] = `${merged[merged.length - 1]}<br/>${line.trim()}`;
    } else {
      merged.push(line);
    }
  });
  return merged.join('\n');
}

function isMermaid(text) {
  const trimmed = text.trimStart();
  return MERMAID_KEYWORDS.some((kw) => trimmed.startsWith(kw));
}

const authoredMermaidEls = [...document.querySelectorAll('pre.mermaid')]
  .filter((pre) => isMermaid(pre.textContent))
  .map((pre) => {
    pre.textContent = normalizeMermaid(pre.textContent);
    return pre;
  });

const codeMermaidEls = [...document.querySelectorAll('pre > code')]
  .filter((code) => !code.closest('pre.mermaid') && isMermaid(code.textContent))
  .map((code) => {
    const pre = document.createElement('pre');
    pre.className = 'mermaid';
    pre.textContent = normalizeMermaid(code.textContent);
    code.parentElement.replaceWith(pre);
    return pre;
  });

const mermaidEls = [...authoredMermaidEls, ...codeMermaidEls];

if (mermaidEls.length > 0) {
  await loadScript('https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js');
  window.mermaid.initialize({ startOnLoad: false, theme: 'dark' });
  await window.mermaid.run({ nodes: mermaidEls });
}
