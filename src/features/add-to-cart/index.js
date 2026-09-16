/**
 * Hydrates add-to-cart button already in HTML.
 * Re-init aborts previous listeners (HMR-safe).
 * @param {HTMLElement} root
 * @param {{ getSelected: () => { label: string, sku: string } }} deps
 */
export function init(root, deps) {
  if (!root) return;

  root.__lkCartAbort?.abort();
  const ac = new AbortController();
  root.__lkCartAbort = ac;
  const { signal } = ac;

  const button = root.querySelector('[data-add-to-cart]');
  const feedback = root.querySelector('[data-cart-feedback]');
  const wrap = root.querySelector('.lk-cart');
  if (!button || !feedback || !wrap) return;

  let timerId = 0;

  const clearTimer = () => {
    window.clearTimeout(timerId);
    timerId = 0;
  };

  signal.addEventListener('abort', clearTimer);

  button.addEventListener(
    'click',
    () => {
      const selected = deps?.getSelected?.();
      if (!selected) return;

      button.classList.add('lk-button--added');
      button.disabled = true;
      button.textContent = 'Добавлено';
      wrap.classList.add('lk-cart--success');
      feedback.textContent = `${selected.label} (арт. ${selected.sku}) — имитация добавления`;

      clearTimer();
      timerId = window.setTimeout(() => {
        button.classList.remove('lk-button--added');
        button.disabled = false;
        button.textContent = 'В корзину';
        wrap.classList.remove('lk-cart--success');
        feedback.textContent = '';
        timerId = 0;
      }, 1800);
    },
    { signal },
  );
}
