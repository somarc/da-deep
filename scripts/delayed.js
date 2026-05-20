import { loadScript } from './aem.js';

const MERMAID_KEYWORDS = [
  'flowchart', 'sequenceDiagram', 'graph ', 'gantt', 'classDiagram',
  'stateDiagram', 'erDiagram', 'journey', 'gitGraph', 'mindmap', 'timeline',
];

function normalizeMermaid(text) {
  return text
    .replaceAll('—', '-')
    .replaceAll('–', '-');
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
