/**
 * Hydrates product card roots already present in HTML (no render).
 * @param {HTMLElement} root
 * @returns {{ els: Record<string, HTMLElement|null>, calcDiscountPercent: Function }}
 */
export function init(root) {
  if (!root) return { els: {}, calcDiscountPercent };

  return {
    els: {
      sku: root.querySelector('[data-product-sku]'),
      price: root.querySelector('[data-product-price]'),
      priceOld: root.querySelector('[data-product-price-old]'),
      discount: root.querySelector('[data-product-discount]'),
      priceMeta: root.querySelector('meta[itemprop="price"]'),
      availability: root.querySelector('[data-product-availability]'),
      availabilityText: root.querySelector('[data-product-availability-text]'),
      packaging: root.querySelector('[data-feature="select-packaging"]'),
      cart: root.querySelector('[data-feature="add-to-cart"]'),
      gallery: root.querySelector('[data-feature="product-gallery"]'),
      favorite: root.querySelector('[data-feature="favorite"]'),
    },
    calcDiscountPercent,
  };
}

export function calcDiscountPercent(oldPrice, price) {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/**
 * @param {string} availability
 * @returns {'ok'|'low'|'order'}
 */
export function availabilityTone(availability) {
  if (availability === 'Мало') return 'low';
  if (availability === 'Под заказ') return 'order';
  return 'ok';
}
