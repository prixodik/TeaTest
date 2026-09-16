import { init as initHeader } from '../../widgets/header/index.js';
import { init as initSidebar } from '../../widgets/product-sidebar/index.js';
import {
  init as initProduct,
  availabilityTone,
} from '../../entities/product/index.js';
import {
  init as initPackaging,
  formatPrice,
} from '../../features/select-packaging/index.js';
import { init as initAddToCart } from '../../features/add-to-cart/index.js';
import { init as initGallery } from '../../features/product-gallery/index.js';
import { init as initFavorite } from '../../features/favorite/index.js';

function flash(el) {
  if (!el) return;
  el.style.opacity = '0.35';
  requestAnimationFrame(() => {
    el.style.opacity = '';
  });
}

function applyAvailability(els, packaging) {
  if (!els.availability || !els.availabilityText || !packaging?.availability) return;

  els.availabilityText.textContent = packaging.availability;
  els.availability.classList.remove(
    'lk-product__availability--low',
    'lk-product__availability--order',
  );

  const tone = availabilityTone(packaging.availability);
  if (tone === 'low') {
    els.availability.classList.add('lk-product__availability--low');
  }
  if (tone === 'order') {
    els.availability.classList.add('lk-product__availability--order');
  }

  flash(els.availability);
}

function applyPackaging(els, packaging, calcDiscountPercent) {
  if (!packaging || !els) return;

  if (els.sku) {
    els.sku.textContent = packaging.sku;
    flash(els.sku);
  }

  if (els.price) {
    els.price.textContent = formatPrice(packaging.price);
    flash(els.price);
  }

  if (els.priceMeta) {
    els.priceMeta.setAttribute('content', String(packaging.price));
  }

  if (els.priceOld) {
    const hasOld = packaging.oldPrice != null && packaging.oldPrice > packaging.price;
    els.priceOld.hidden = !hasOld;
    if (hasOld) {
      els.priceOld.textContent = formatPrice(packaging.oldPrice);
      flash(els.priceOld);
    }
  }

  if (els.discount) {
    const percent = calcDiscountPercent?.(packaging.oldPrice, packaging.price);
    const show = percent != null && percent > 0;
    els.discount.hidden = !show;
    if (show) {
      els.discount.textContent = `−${percent}%`;
    }
  }

  applyAvailability(els, packaging);
}

/**
 * Hydrates product page: static HTML already contains widgets + product.
 * @param {{
 *   header: HTMLElement,
 *   product: HTMLElement,
 *   sidebar: HTMLElement,
 * }} mounts
 */
export function init(mounts) {
  const { header, product, sidebar } = mounts;

  initHeader(header);
  initSidebar(sidebar);

  const { els, calcDiscountPercent } = initProduct(product);

  initGallery(els.gallery);
  initFavorite(els.favorite);

  const packagingApi = initPackaging(els.packaging, {
    onChange: (selected) => {
      applyPackaging(els, selected, calcDiscountPercent);
    },
  });

  initAddToCart(els.cart, {
    getSelected: packagingApi.getSelected,
  });
}
