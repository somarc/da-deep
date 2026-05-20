const HEADERS_BY_BLOCK = {
  criterion: ['Criterion', 'Sidekick Extension', 'EDS Plugin'],
  'da-route-classify-verdict': ['da route classify Verdict', 'Meaning', 'What Delivers the Page', 'Expected?', 'Action If Unexpected'],
  'da-table-header': ['DA Table Header', 'Block Class in .plain.html', 'File Path Loaded'],
  dimension: ['Dimension', 'Block', 'Plugin'],
  failure: ['Failure', 'Symptom', 'da site info / da preview page Output', 'Remediation'],
  field: ['Field', 'Defined In helix-query.yaml', 'Consumed By'],
  flag: ['Flag', 'Values', 'Description'],
  phase: ['Phase', 'Fires When', 'Blocks Page Render?', 'Use For'],
  property: ['Property', 'Extracted From', 'Always Present?', 'type Annotation', 'Notes'],
  rule: ['Rule', 'Rationale'],
  service: ['Service', 'Role', 'Owns Durable State?', 'Interface', 'Canonical Endpoint', 'Access Model', 'Inspect With'],
  state: ['State', 'Where Stored', 'Visible At', 'Triggered By', 'Inspect With'],
  surface: ['Surface', 'Domain', 'Typical TTL', 'Invalidated By', 'How to Verify Freshness'],
  symptom: ['Symptom', 'Layer', 'Root Cause', 'Diagnostic Command / Check', 'Remediation'],
};

function appendRow(table, cells, tag) {
  const tr = document.createElement('tr');
  cells.forEach((cell) => {
    const tableCell = document.createElement(tag);
    if (typeof cell === 'string') {
      tableCell.textContent = cell;
    } else {
      while (cell.firstChild) tableCell.append(cell.firstChild);
    }
    tr.append(tableCell);
  });
  table.append(tr);
}

export default function decorateTableBlock(block) {
  const blockName = block.dataset.blockName || 'data';
  const table = document.createElement('table');
  table.className = `${blockName}-table`;

  const headers = HEADERS_BY_BLOCK[blockName];
  if (headers) appendRow(table, headers, 'th');

  [...block.children].forEach((row, rowIndex) => {
    appendRow(table, [...row.children], headers || rowIndex > 0 ? 'td' : 'th');
  });

  block.replaceChildren(table);
}
