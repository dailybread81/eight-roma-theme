/**
 * Eight Roma — store locator.
 * Loads the Google Maps embed only after the visitor asks for it (it sets
 * third-party cookies) and points the map at the store they select.
 * Markup and styles: sections/eight-store-locator.liquid.
 */

class EightStoreLocator extends HTMLElement {
  /** @type {AbortController | undefined} */
  #controller;

  connectedCallback() {
    this.#controller = new AbortController();
    this.addEventListener('click', this.#handleClick, { signal: this.#controller.signal });
  }

  disconnectedCallback() {
    this.#controller?.abort();
  }

  /** @param {MouseEvent} event */
  #handleClick = (event) => {
    if (!(event.target instanceof Element)) return;

    if (event.target.closest('[data-load-map]')) {
      this.#loadMap();
      return;
    }

    const showButton = event.target.closest('[data-show-on-map]');
    const item = showButton?.closest('[data-map-query]');
    if (item instanceof HTMLElement) this.#select(item);
  };

  /** @param {HTMLElement} item */
  #select(item) {
    for (const other of this.querySelectorAll('[data-map-query]')) {
      const isSelected = other === item;
      other.classList.toggle('is-selected', isSelected);
      other.querySelector('[data-show-on-map]')?.setAttribute('aria-pressed', String(isSelected));
    }

    const frame = this.#frame;
    if (frame) frame.dataset.query = item.dataset.mapQuery ?? '';
    this.#loadMap();
  }

  #loadMap() {
    const frame = this.#frame;
    if (!frame) return;

    const url = `${frame.dataset.srcBase ?? ''}${encodeURIComponent(frame.dataset.query ?? '')}`;
    if (frame.getAttribute('src') !== url) frame.setAttribute('src', url);
    frame.hidden = false;
    this.querySelector('[data-map-consent]')?.setAttribute('hidden', '');
  }

  get #frame() {
    const frame = this.querySelector('.eight-stores__frame');
    return frame instanceof HTMLIFrameElement ? frame : null;
  }
}

if (!customElements.get('eight-store-locator')) {
  customElements.define('eight-store-locator', EightStoreLocator);
}
