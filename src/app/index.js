import './styles.scss';
import { init as initProductPage } from '../pages/product/index.js';

const mounts = {
  header: document.querySelector('[data-widget="header"]'),
  product: document.querySelector('[data-entity="product"]'),
  sidebar: document.querySelector('[data-widget="sidebar"]'),
};

initProductPage(mounts);
