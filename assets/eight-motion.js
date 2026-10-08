/**
 * Eight Roma — motion layer.
 * Tags reveal targets inside the main content and reveals them as they enter the
 * viewport. Styles live in assets/eight-motion.css. Skips everything when the visitor
 * prefers reduced motion or the page is open in the theme editor.
 */

const SELECTORS = {
  hero: '#MainContent .hero__media-grid',
  media: '#MainContent .image-block',
  text: '#MainContent .text-block:is(.h1, .h2, .h3)',
};

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const designMode = Boolean(window.Shopify && window.Shopify.designMode);

/** @type {IntersectionObserver | undefined} */
let observer;

/**
 * Tags new reveal targets under `root` and starts observing them.
 * @param {ParentNode} root
 */
function setup(root = document) {
  if (!observer) return;

  for (const [type, selector] of Object.entries(SELECTORS)) {
    const elements = root.querySelectorAll(selector);

    elements.forEach((element, index) => {
      if (!(element instanceof HTMLElement) || element.dataset.eightReveal) return;

      element.dataset.eightReveal = type;
      if (type === 'text') element.style.setProperty('--eight-delay', `${(index % 3) * 0.12}s`);
      observer.observe(element);
    });
  }
}

if (reducedMotion || designMode || !('IntersectionObserver' in window)) {
  document.documentElement.classList.remove('eight-motion');
} else {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
  );

  document.documentElement.classList.add('eight-motion');
  window.eightMotionReady = true;
  setup();

  // Content swapped in by the theme (filters, pagination, section rendering)
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) setup(node.parentNode ?? node);
      });
    }
  }).observe(document.getElementById('MainContent') ?? document.body, { childList: true, subtree: true });
}
