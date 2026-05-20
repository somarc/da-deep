export default function decorateTableBlock(block) {
  const table = document.createElement('table');
  table.className = `${block.dataset.blockName || 'data'}-table`;

  [...block.children].forEach((row, rowIndex) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((cell) => {
      const tag = rowIndex === 0 ? 'th' : 'td';
      const tableCell = document.createElement(tag);
      while (cell.firstChild) tableCell.append(cell.firstChild);
      tr.append(tableCell);
    });
    table.append(tr);
  });

  block.replaceChildren(table);
}
