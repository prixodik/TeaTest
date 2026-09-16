/**
 * Packaging variants for Ананасовый улун.
 * Prices stored as number (rubles); display formatted in UI.
 */
export const packagings = [
  {
    id: '100',
    label: '100 г',
    sku: '01306',
    price: 326.4,
    oldPrice: 349.2,
    availability: 'Много',
  },
  {
    id: '500',
    label: '500 г',
    sku: '01307',
    price: 1432,
    oldPrice: 1646,
    availability: 'Много',
  },
  {
    id: '1000',
    label: '1000 г',
    sku: '01308',
    price: 2064,
    oldPrice: 2592,
    availability: 'Мало',
  },
  {
    id: '5000',
    label: '5000 г',
    sku: '01309',
    price: 6320,
    oldPrice: 8710,
    availability: 'Под заказ',
  },
];

export function getPackagingById(id) {
  return packagings.find((item) => item.id === id) ?? packagings[0];
}

/**
 * @param {number} value
 * @returns {string}
 */
export function formatPrice(value) {
  const hasCents = !Number.isInteger(value);
  return (
    new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: hasCents ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(value) + ' ₽'
  );
}
