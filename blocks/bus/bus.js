const COLUMNS = ['Bus', 'Latency', 'Mechanism', 'Triggered By', 'Consistency Model', 'Inspect With'];

export default function decorate(block) {
  const table = document.createElement('table');

  const thead = table.createTHead();
  const headerRow = thead.insertRow();
  COLUMNS.forEach((col) => {
    const th = document.createElement('th');
    th.textContent = col;
    headerRow.append(th);
  });

  const tbody = table.createTBody();
  [...block.children].forEach((row) => {
    const tr = tbody.insertRow();
    [...row.children].forEach((cell) => {
      const td = tr.insertCell();
      td.innerHTML = cell.innerHTML;
    });
  });

  block.replaceChildren(table);
}
