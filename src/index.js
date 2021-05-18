// @ts-check
import { useState, hooked, useReducer } from './hook';

/**
 * @typedef { { [key:string]: unknown } } ElementPlusProps
 */

/** @class */
export default class ElementPlus {
	[Symbol.toStringTag]() {
		return 'ElementPlus';
	}

	/**
	 * @param {string} selector - added as a class and ID;
	 * @param {ElementPlusProps} props - a props object
	 */
	constructor(selector, props) {
		/** @type {HTMLElement} */
		this.el = document.querySelector(selector);
		this.refs = new Proxy(
			{},
			{
				get: this.__queryElement.bind(this),
			}
		);

		this.useState = useState;
		this.useReducer = useReducer;
		this.hooked = hooked;
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
		return this.el.querySelector('[ref="' + name + '"]');
	}

	/**
	 * @param {string} name - event name, is prefixed with constructed elements name and a double colon
	 * @param {object} detail - a custom detail for the CustomEvent
	 */
	emitEvent(name, detail = {}, target = document) {
		const evt = new CustomEvent(this.constructor.name + '::' + name, {
			bubbles: true,
			detail,
		});

		target.dispatchEvent(evt);
	}
}
