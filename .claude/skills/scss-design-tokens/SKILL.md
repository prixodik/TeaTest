---
name: scss-design-tokens
description: Use when writing or editing the <style> block of a Vue SFC in this project — creating a new lk-*.vue component, adding a visual variant/modifier/hover state, or adding responsive/breakpoint behavior to an existing component.
---

# SCSS + Local Design Tokens

## Overview

Every component's styles are plain BEM CSS, written in SCSS, where every
value that could vary — by modifier, hover/focus state, or breakpoint — is
a CSS custom property scoped to the component's block selector. Variant
selectors, state pseudo-classes, and media queries never introduce new
`@apply` utility lists — they only reassign the existing custom-property
values. This is a client-mandated convention for this codebase; do not
substitute plain Tailwind classes in templates or generic Vue `scoped` CSS
instead.

**`@apply` is a convenience, not a mandate.** The hard rule is "read the
value from a token." Whether that line is written as a Tailwind utility via
`@apply` or as a plain CSS declaration referencing the same `var(...)` is a
judgment call — see rule 4.

## When to Use

- Writing the `<style>` block for a new `lk-*.vue` component.
- Adding a variant/modifier or a hover/focus state to an existing one.
- Adding responsive behavior to a component that doesn't have any yet.
- Reviewing a component whose `<style scoped>` block uses `@apply` with
  literal utility classes (`bg-brand`, `sm:flex-1`, etc.) directly in
  selectors — that's the pre-token pattern and should be converted.

## Core Pattern

```scss
<style lang="scss">
@reference "#styles/app.css";

.lk-badge {
  --lk-badge--bg: var(--color-danger);   // 1. token per varying value —
  --lk-badge--color: #fff;               //    global token when one already
  --lk-badge--size: 22px;                //    fits, plain literal otherwise
  --lk-badge--offset: -10px;             //    (px, matching Figma directly)

  @apply absolute flex items-center justify-center rounded-full;
  @apply bg-[var(--lk-badge--bg)] text-[var(--lk-badge--color)];
  @apply h-[var(--lk-badge--size)] min-w-[var(--lk-badge--size)];
  @apply top-[var(--lk-badge--offset)] right-[var(--lk-badge--offset)];

  font-weight: 700;                      // 2. plain CSS is equally valid —
                                          //    doesn't have to go through
                                          //    @apply just because it could

  &--muted {                             // 3. modifier = token overrides only
    --lk-badge--bg: var(--color-surface-muted);
  }

  &:hover {                              // 4. state = token overrides too,
    --lk-badge--bg: var(--color-brand-dark);  //    same rule as a modifier
  }

  @media (min-width: 768px) {            // 5. mobile-first: base above IS
    --lk-badge--size: 26px;              //    mobile; min-width blocks only
  }                                      //    reassign tokens, never add
}                                        //    new @apply lines
</style>
```

Rules this encodes:

1. **No `scoped` attribute.** BEM naming (`lk-<component>`, `&__part`,
   `&--modifier`) is already collision-free across the whole app, so Vue's
   scoping is redundant.
2. **One local custom property per value that can change** — via a
   modifier, a `:hover`/`:focus` state, or a breakpoint. A value that's
   genuinely fixed (e.g. `shrink-0`, `whitespace-nowrap`, `font-weight: 700`
   used only once) doesn't need one.
3. **Default a token to the matching global token when one already exists**
   (`--lk-button--bg: var(--color-brand);`), or to another local token on
   the same block for composition (`--lk-button--border: var(--lk-button--bg);`).
   Otherwise a plain literal is fine — you don't need to invent a global
   theme entry just to avoid a literal (`--lk-badge--color: #fff;`,
   `--header-menu--item-bg: #F8FAFB;` are both fine as-is). **Units: prefer
   `px`**, matching the values Figma exports directly, not `rem`.
4. **`@apply` for the bulk of a rule; plain CSS wherever it reads better.**
   Use `@apply` with arbitrary-value syntax to read a token —
   `h-[var(--lk-icon--height)]`. In practice a bare `text-[var(--x)]` or
   `border-[var(--x)]` resolves to the color property correctly without
   needing a `[color:...]` type hint — only add one if Tailwind visibly
   picks the wrong interpretation. But nothing requires forcing *every*
   declaration through `@apply`: `font-size: var(--x);`,
   `text-transform: uppercase;`, `border: 2px solid var(--x);`,
   `transition: all 0.2s ease-in-out;` as plain CSS are all normal and seen
   throughout this codebase, including for properties Tailwind does have a
   utility for. Only reach for the `@apply [property:var(--x)]`
   arbitrary-*property* form as a last resort — prefer plain CSS instead
   (see Common Mistakes).
5. **Modifiers, states, and media queries reassign tokens — nothing else.**
   `&--outline`, `&:hover`, `&:focus`, and `@media (min-width: …)` all
   follow the same rule: override one or more `--token` values, never add
   a parallel `@apply` list. They can be combined on one selector group
   when they share the same overrides: `&:hover, &--active { --token: …; }`.
6. **Mobile-first, always `min-width`.** The un-media-queried values at
   the top of the block ARE the mobile layout. Never use `max-width`. This
   project's actual breakpoints so far are `768px` (tablet) and `1100px`
   (desktop) — reuse those unless the Figma frame you're matching calls for
   a different one.
7. **A component may reach into a child component's rendered root to theme
   it in context** — there's no `scoped` isolation stopping it, and it's an
   accepted pattern here. Two ways, pick whichever reads clearer:
   - Nest the child's own block class directly:
     `.lk-icon { @apply ...; }` inside `.lk-button` compiles to
     `.lk-button .lk-icon { ... }`.
   - Or pass an extra BEM element class on the child in the template
     (`<LkIcon class="header-menu__icon" />`) and style that class from the
     parent's own block (`&__icon { color: var(--x); }`).
   Keep this to real theming (color/size/spacing) — don't use it to
   reimplement a child's internal structure.

## Quick Reference

| Need | Syntax |
|---|---|
| Plain value from a token | `h-[var(--lk-icon--height)]` |
| Color/length utility (rarely ambiguous in practice) | `text-[var(--x)]`, `border-[var(--x)]` — add `text-[color:var(--x)]` / `text-[length:var(--x)]` only if Tailwind picks the wrong one |
| A one-off declaration, even if Tailwind has a utility for it | plain CSS is fine: `font-size: var(--x);`, `text-transform: uppercase;` |
| No real Tailwind utility for the property (keyword-only, no scale) | plain CSS: `justify-content: var(--x);`, `flex: var(--x);`, `order: var(--x);` — not `@apply [property:var(--x)]` |
| Negative offset via token | give the token the negative value itself: `--x: -10px;` then `top-[var(--x)]` |
| BEM element | `&__label { ... }` |
| BEM modifier | `&--outline { --token: new-value; }` |
| Hover/focus state | `&:hover { --token: new-value; }` — same rule as a modifier |
| Responsive override | `@media (min-width: 768px) { --token: new-value; }` nested inside the block |
| Theme a child component in context | `.lk-icon { @apply ...; }` nested inside the parent's block, or pass it a `&__element` class from the template |

## Common Mistakes

- **`@tailwindcss/vite` silently drops `lang="scss"` style blocks.** It
  only intercepts `.css`-suffixed virtual modules; a Vue SFC's SCSS style
  block compiles to a `...lang.scss` module and never reaches it, so every
  `@apply`/`@reference` survives untouched as literal (invalid) CSS —
  the component renders completely unstyled with no build error. This
  project uses the classic PostCSS integration instead
  (`@tailwindcss/postcss` + `postcss.config.js`) specifically to avoid
  this. If `@apply` stops working after touching build config, check
  `dist/assets/*.css` for a literal `@apply` string — its presence means
  Tailwind never processed that file.
- **`@reference` cannot use a Vite alias.** `@reference "@styles/app.css"`
  fails to resolve — PostCSS's own import resolver doesn't know about
  `vite.config.ts` aliases (it's a separate resolver, not Vite's). Instead
  use the Node.js subpath import defined in `package.json`'s `"imports"`
  field, which that resolver does understand:
  `@reference "#styles/app.css";` — the same string works from any file
  regardless of its depth, so always use this form rather than counting
  `../` segments.
- **Forgetting `@reference` entirely.** Needed on *every* `<style>` block
  that uses `@apply`, even for Tailwind's own built-in utilities like
  `border-slate-200` — not just for this project's custom tokens. Without
  it: "Cannot apply unknown utility class".
- **A missing semicolon after a custom-property declaration silently
  swallows the next line.** `--x: 10px` (no `;`) followed by `@apply
  bg-white;` on the next line compiles to `--x: 10px @apply bg-white` — a
  single custom property whose value is that literal token soup, and the
  `@apply` never runs, with no build error. If a rule you can see in the
  source isn't showing up on the page, check for a missing `;` on the line
  above it first.
- **Adding a whole new `@apply` line inside a modifier, state, or media
  query** instead of reassigning a token. If you catch yourself writing
  `&--outline { @apply border-brand; }` or `&:hover { @apply bg-brand-dark; }`,
  stop — override the token instead (`--lk-button--border: var(--color-brand);`
  / `--lk-button--bg: var(--color-brand-dark);`) and keep the `@apply` list
  in the base block only.
- **Reaching for `@apply [justify-content:var(--x)]` (or `flex`, `order`,
  `flex-wrap`, `align-items`, …) and having it silently do nothing / fail
  to apply.** These are static, keyword-only Tailwind utilities with no
  numeric or color scale behind them, so Tailwind never generates an
  arbitrary-value form for the bare prefix (`justify-[...]` isn't a thing,
  unlike `w-[...]` or `top-[...]`). Don't fight it with the
  arbitrary-*property* `@apply [property:var(--x)]` form either — just
  drop to plain CSS for that one declaration: `justify-content: var(--x);`.
  It's still one line reading from the token; it doesn't need to go
  through Tailwind to follow this pattern.
