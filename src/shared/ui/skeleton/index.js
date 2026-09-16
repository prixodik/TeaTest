/**
 * Renders skeleton placeholders into root.
 * @param {HTMLElement} root
 * @param {{ markup: string }} options
 */
export function init(root, { markup } = {}) {
  if (!root || !markup) return;
  root.innerHTML = markup;
}
