/**
 * @module stack-l
 * @description
 * A custom element for injecting white space (margin) between flow 
 * (block) elements along a vertical axis.
 * @property {string} space=var(--s1) A CSS `margin` value
 * @property {boolean} recursive=false Whether the spaces apply recursively (i.e. regardless of nesting level)
 */

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stack-l": any
    }
  }
}

export default class Stack extends HTMLElement {
  render: () => void;
  i: string;

  constructor() {
    super();

    this.render = () => {
      this.i = `Stack-${[this.space, this.recursive].join('')}`;
      this.dataset.i = this.i;
      if (!document.getElementById(this.i)) {
        let styleEl = document.createElement('style');
        styleEl.id = this.i;
        styleEl.innerHTML = `
          [data-i="${this.i}"]${this.recursive ? '' : ' >'} * + * {
            margin-block-start: ${this.space};
          }
        `.replace(/\s\s+/g, ' ').trim();
        document.head.appendChild(styleEl);
      }
    }
  }

  get space() {
    return this.getAttribute('space') || 'var(--vertical-rhythm)';
  }

  set space(val) {
    this.setAttribute('space', val ?? 'var(--vertical-rhythm)');
  }

  get recursive() {
    return this.hasAttribute('recursive') ? 'recursive' : '';
  }

  set recursive(val) {
    this.setAttribute(val ? 'recursive' : '', '');
  }

  static get observedAttributes() {
    return ['space', 'recursive'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  static define() {
    if ('customElements' in window) {
      customElements.define('stack-l', Stack);
    }
  }
}

