# Карточка товара Teaboom

Верхняя часть карточки «Ананасовый улун» (HTML5 + SCSS + vanilla JS, Vite).  
Архитектура: облегчённый FSD + **progressive enhancement** — вся разметка в `index.html`, JS только гидратирует (фасовки, корзина). Контент виден без JS (SEO).

Референс: [Ананасовый улун](https://teaboom.ru/product/ananasovij-ulun)

## Запуск

```bash
npm install
npm run dev
```

Откройте URL из терминала (обычно `http://localhost:5173`).

## Сборка

```bash
npm run build
npm run preview
```

Артефакты — в `dist/`.

## Демо (GitHub Pages)

Сайт: https://prixodik.github.io/TeaTest/

Деплой: GitHub Actions собирает Vite (`npm run build`) и публикует `dist`.  
Нужен `base: '/TeaTest/'` в `vite.config.js` (уже задан).

## Структура

```
index.html       # полная семантика страницы (источник правды для SEO)
src/
  app/           # bootstrap / hydrate
  pages/product/ # связка фич на уже готовом DOM
  widgets/       # стили + хуки шапки/сайдбара
  features/      # фасовка, «В корзину» (только поведение)
  entities/      # стили карточки + селекторы
  shared/        # токены, reset, UI-примитивы
```

## Что сделано по ТЗ

- изображение (галерея), название, категория, фасовки, артикул, цены, «В корзину», описание;
- переключение фасовки меняет цену, старую цену, артикул, selected и наличие;
- hover у кнопки «В корзину»;
- галерея + lightbox, избранное, ссылка «Оставить отзыв»;
- акцент `#f5d730`;
- адаптив: 375 / 768 / 1440 (десктоп-сетка с 1200px).
