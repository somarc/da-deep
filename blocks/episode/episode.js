// Cell roles in authored order: name (strong), question, representative commands.
const CELL_ROLES = ['name', 'question', 'commands'];

/**
 * Canvas-safe decoration: classes and ARIA roles are added to the existing
 * block, row and cell wrappers only. No authored node is moved, cloned or
 * rebuilt, so DA Canvas prose/block markers keep their identity.
 * @param {Element} block The episode block element
 */
export default function decorate(block) {
  block.setAttribute('role', 'list');
  [...block.children].forEach((row) => {
    row.classList.add('episode-step');
    row.setAttribute('role', 'listitem');
    [...row.children].forEach((cell, i) => {
      if (CELL_ROLES[i]) cell.classList.add(`episode-${CELL_ROLES[i]}`);
    });
  });
}
