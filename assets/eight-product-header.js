/**
 * Eight Roma — product page header.
 * Hides the sticky header once the product information section has been scrolled
 * past, and brings it back when that section re-enters the viewport.
 * Loaded only on product templates from snippets/scripts.liquid; styles live in
 * assets/eight-motion.css (`.eight-header-hidden`).
 *
 * The theme scrolls `.page-wrapper` on desktop and the document on mobile, so scroll
 * is listened for in the capture phase on `document`, which receives both.
 */

const HIDDEN_CLASS = 'eight-header-hidden';

const stickyHeader = document.querySelector('#header-component[sticky]');
const getSection = () => {
  const section = document.querySelector('#MainContent .product-information');
  return section?.closest('.shopify-section') ?? section;
};

if (stickyHeader && getSection()) {
  const root = document.documentElement;
  let frame = 0;

  const update = () => {
    frame = 0;
    const section = getSection();
    if (!section) return;
    root.classList.toggle(HIDDEN_CLASS, section.getBoundingClientRect().bottom <= 0);
  };

  const requestUpdate = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  document.addEventListener('scroll', requestUpdate, { capture: true, passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  update();
}
