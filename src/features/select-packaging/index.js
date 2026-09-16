import { packagings, getPackagingById, formatPrice } from './model.js';

/**
 * Hydrates packaging controls from existing HTML.
 * Re-init aborts previous listeners (HMR-safe).
 * @param {HTMLElement} root
 * @param {{
 *   onChange?: (packaging: object) => void,
 *   syncOnInit?: boolean,
 * }} [deps]
 * @returns {{ getSelected: () => object }}
 */
export function init(root, deps = {}) {
  if (!root) {
    return { getSelected: () => packagings[0] };
  }

  root.__lkPackagingAbort?.abort();
  const ac = new AbortController();
  root.__lkPackagingAbort = ac;
  const { signal } = ac;

  const buttons = [...root.querySelectorAll('[data-packaging-id]')];
  const active = root.querySelector('.lk-packaging__item--active, [aria-pressed="true"]');
  let selectedId = active?.dataset.packagingId ?? packagings[0].id;

  const emit = () => {
    deps.onChange?.(getPackagingById(selectedId));
  };

  const setActive = (id) => {
    selectedId = id;
    buttons.forEach((btn) => {
      const isActive = btn.dataset.packagingId === id;
      btn.classList.toggle('lk-packaging__item--active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
    emit();
  };

  buttons.forEach((btn) => {
    btn.addEventListener(
      'click',
      () => {
        if (btn.dataset.packagingId === selectedId) return;
        setActive(btn.dataset.packagingId);
      },
      { signal },
    );
  });

  if (deps.syncOnInit) {
    emit();
  }

  return {
    getSelected: () => getPackagingById(selectedId),
    formatPrice,
  };
}

export { formatPrice, getPackagingById, packagings };
