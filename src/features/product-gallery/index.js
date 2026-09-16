/**
 * Hydrates product image gallery + lightbox zoom.
 * Markup must already exist in HTML (progressive enhancement).
 * Re-init aborts previous listeners (HMR-safe).
 * @param {HTMLElement} root
 */
export function init(root) {
  if (!root) return;

  root.__lkGalleryAbort?.abort();
  const ac = new AbortController();
  root.__lkGalleryAbort = ac;
  const { signal } = ac;

  const mainImg = root.querySelector('[data-gallery-main]');
  const thumbs = [...root.querySelectorAll('[data-gallery-thumb]')];
  const lightbox = root.querySelector('[data-gallery-lightbox]');
  const lightboxImg = root.querySelector('[data-gallery-lightbox-img]');
  const openBtn = root.querySelector('[data-gallery-open]');
  const closeBtn = root.querySelector('[data-gallery-close]');
  const prevBtn = root.querySelector('[data-gallery-prev]');
  const nextBtn = root.querySelector('[data-gallery-next]');

  if (!mainImg || !thumbs.length || !lightbox || !lightboxImg) return;

  let index = Math.max(
    0,
    thumbs.findIndex((t) => t.classList.contains('lk-gallery__thumb--active')),
  );
  let fadeTimerId = 0;
  /** @type {AbortController | null} */
  let keydownAc = null;

  const onKeydown = (event) => {
    if (event.key === 'Escape') {
      closeLightbox();
      return;
    }
    if (event.key === 'ArrowLeft') setIndex(index - 1);
    if (event.key === 'ArrowRight') setIndex(index + 1);
  };

  const bindKeydown = () => {
    if (keydownAc) return;
    keydownAc = new AbortController();
    document.addEventListener('keydown', onKeydown, { signal: keydownAc.signal });
  };

  const unbindKeydown = () => {
    keydownAc?.abort();
    keydownAc = null;
  };

  const clearFadeTimer = () => {
    window.clearTimeout(fadeTimerId);
    fadeTimerId = 0;
  };

  const setIndex = (nextIndex) => {
    index = (nextIndex + thumbs.length) % thumbs.length;
    const thumb = thumbs[index];
    const src = thumb.dataset.fullSrc || thumb.querySelector('img')?.src;
    const alt = thumb.querySelector('img')?.alt || mainImg.alt;

    root.style.setProperty('--lk-gallery--main-opacity', '0');
    clearFadeTimer();
    fadeTimerId = window.setTimeout(() => {
      mainImg.src = src;
      mainImg.alt = alt;
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      root.style.setProperty('--lk-gallery--main-opacity', '1');
      fadeTimerId = 0;
    }, 140);

    thumbs.forEach((t, i) => {
      const active = i === index;
      t.classList.toggle('lk-gallery__thumb--active', active);
      if (active) {
        t.setAttribute('aria-current', 'true');
      } else {
        t.removeAttribute('aria-current');
      }
    });
  };

  const openLightbox = () => {
    lightbox.dataset.open = 'true';
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    bindKeydown();
    closeBtn?.focus();
  };

  const closeLightbox = () => {
    lightbox.dataset.open = 'false';
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    unbindKeydown();
    openBtn?.focus();
  };

  const teardown = () => {
    clearFadeTimer();
    unbindKeydown();
    if (lightbox.dataset.open === 'true') {
      lightbox.dataset.open = 'false';
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  signal.addEventListener('abort', teardown);

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => setIndex(i), { signal });
  });

  openBtn?.addEventListener('click', () => openLightbox(), { signal });
  closeBtn?.addEventListener('click', () => closeLightbox(), { signal });
  prevBtn?.addEventListener('click', () => setIndex(index - 1), { signal });
  nextBtn?.addEventListener('click', () => setIndex(index + 1), { signal });

  lightbox.addEventListener(
    'click',
    (event) => {
      if (event.target === lightbox) closeLightbox();
    },
    { signal },
  );

  window.addEventListener('pagehide', teardown, { signal });
}
