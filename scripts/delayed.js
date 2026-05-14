import { loadScript } from './aem.js';

const MERMAID_KEYWORDS = [
  'flowchart', 'sequenceDiagram', 'graph ', 'gantt', 'classDiagram',
  'stateDiagram', 'erDiagram', 'journey', 'gitGraph', 'mindmap', 'timeline',
];

const mermaidEls = [...document.querySelectorAll('pre > code')]
  .filter((code) => {
    const text = code.textContent.trimStart();
    return MERMAID_KEYWORDS.some((kw) => text.startsWith(kw));
  })
  .map((code) => {
    const pre = document.createElement('pre');
    pre.className = 'mermaid';
    pre.textContent = code.textContent;
    code.parentElement.replaceWith(pre);
    return pre;
  });

if (mermaidEls.length > 0) {
  await loadScript('https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js');
  window.mermaid.initialize({ startOnLoad: false, theme: 'dark' });
  await window.mermaid.run({ nodes: mermaidEls });
}
