/**
 * Toggle favorite button state (no backend).
 * Re-init aborts previous listeners (HMR-safe).
 * @param {HTMLElement} root — button or wrapper containing [data-favorite]
 */
export function init(root) {
  if (!root) return;

  const button = root.matches?.('[data-favorite]')
    ? root
    : root.querySelector?.('[data-favorite]');
  if (!button) return;

  button.__lkFavoriteAbort?.abort();
  const ac = new AbortController();
  button.__lkFavoriteAbort = ac;

  button.addEventListener(
    'click',
    () => {
      const active = button.classList.toggle('lk-favorite--active');
      button.setAttribute('aria-pressed', String(active));
      button.setAttribute(
        'aria-label',
        active ? 'Убрать из избранного' : 'Добавить в избранное',
      );
    },
    { signal: ac.signal },
  );
}
