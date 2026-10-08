/**
 * Eight Roma — product page header.
 * Hides the sticky header once the product information section has been scrolled
 * past, and brings it back when that section re-enters the viewport.
 * Loaded only on product templates from snippets/scripts.liquid; styles live in
 * assets/eight-motion.css (`.eight-header-hidden`).
 */

const HIDDEN_CLASS = 'eight-header-hidden';

const productSection = document.querySelector('#MainContent .product-information');
const stickyHeader = document.querySelector('#header-component[sticky]');

if (productSection && stickyHeader && 'IntersectionObserver' in window) {
  const root = document.documentElement;

  new IntersectionObserver(
    ([entry]) => {
      if (!entry) return;
      // Past the section: it no longer intersects and its bottom sits above the viewport
      const isPast = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
      root.classList.toggle(HIDDEN_CLASS, isPast);
    },
    { threshold: 0 }
  ).observe(productSection);
}
