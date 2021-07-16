// @ts-check

/**
 * @typedef { { [key:string]: unknown } } ElementPlusProps
 */

export default class ElementPlus {
	[Symbol.toStringTag]() {
		return 'ElementPlus';
	}

	/**
	 * @param {string|HTMLElement} element - added as a class and ID;
	 * @param {ElementPlusProps} props - a props object
	 */
	constructor(element, props) {
		/** @type {HTMLElement} */
		this.el = element instanceof HTMLElement ? element : document.querySelector(element);
		this.refs = new Proxy(
			{},
			{
				get: this.__queryElement.bind(this),
			}
		);
		this.eventPrefix = props.eventPrefix || this.constructor.name.toLowerCase();
	}

	static get templateHTML() {
		return ``;
	}

	static get template() {
		if (this.__templateEl) return this.__templateEl;

		this.__templateEl = document.createElement('template');
		this.__templateEl.innerHTML = this.templateHTML;

		return this.__templateEl;
	}

	get content() {
		// gets the document fragment from the template element -cw src: https://developer.mozilla.org/en-US/docs/Web/API/Document/importNode + https://github.com/AdaRoseCannon/html-element-plus/blob/master/html-element-plus.js#L52-L54
		// @ts-ignore
		return document.importNode(this.constructor.template.content, true);
	}

	/**
	 * QuerySelector for the constructed element
	 * @param {unknown} target - ignore this param
	 * @param {string} name - reference to query for
	 */
	__queryElement(target, name) {
		if (name[0] === '$') {
			return [...this.el.querySelectorAll('[data-ref="' + name.slice(1) + '"]')];
		}
		return this.el.querySelector('[data-ref="' + name + '"]');
	}

	/**
	 * @param {string} name - event name, is prefixed with constructed elements name and a double colon
	 * @param {object} detail - a custom detail for the CustomEvent
	 * @param {HTMLElement|null} target - dispatchEvent target
	 */
	dispatchEvent(name, detail = {}, target = null) {
		const evt = new CustomEvent(this.eventPrefix + ':' + name, {
			bubbles: true,
			detail,
		});

		(target || this.el).dispatchEvent(evt);
	}
}
