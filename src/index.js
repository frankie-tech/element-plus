// @ts-check
import { useState, hooked, useReducer } from './hook';

/** @class */
export default class ElementPlus {
	[Symbol.toStringTag]() {
		return 'ElementPlus';
	}

	/**
	 *
	 * @param {string} selector - added as a class and ID;
	 */
	constructor(selector) {
		// prettier-ignore
		const onBeforeConstructCallbackResults = this.onBeforeConstructCallback(selector);

		this.selector = selector;
		this.refs = new Proxy(
			{},
			{
				get: this.__queryElement.bind(this),
			}
		);

		this.useState = useState;
		this.useReducer = useReducer;
		this.hooked = hooked;

		this.__evts = {};

		this.onConstructCallback(onBeforeConstructCallbackResults);
		this.emitEvent('Constructed');

		/** @type {HTMLElement} */
		this.el = null;
	}

	static get templateStyles() {
		return ``;
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

	static get styles() {
		if (this.__styleEl) return this.__styleEl;

		this.__styleEl = document.createElement('template');

		// Adds style element to template element minifying the styles at the same times
		this.__styleEl.innerHTML = `<style>${this.templateStyles}</style>`.replace(
			/ {4}|[\t\n\r]/gm,
			''
		);

		return this.__styleEl;
	}

	get content() {
		// gets the document fragment from the template element -cw src: https://developer.mozilla.org/en-US/docs/Web/API/Document/importNode + https://github.com/AdaRoseCannon/html-element-plus/blob/master/html-element-plus.js#L52-L54
		const content = {
			/** @type {HTMLElement} */
			template:
				// @ts-ignore
				this.constructor.template.content,
			/** @type {HTMLStyleElement} */
			styles: document.importNode(
				// @ts-ignore
				this.constructor.styles.content,
				true
			),
		};
		return content;
	}

	// Convert the class selector into a PascalCase ID to apply to the template
	get id() {
		// split at the dash, capitalize the first letter, rejoin with no space;
		if (!this.__id)
			this.__id = this.selector
				.slice(1, this.selector.length)
				.split('-')
				.map(word => word.charAt(0).toUpperCase() + word.slice(1))
				.join('');
		return this.__id;
	}

	/**
	 * QuerySelector for the constructed element
	 * @param {unknown} target
	 * @param {string} name - reference to query for
	 */
	__queryElement(target, name) {
		return this.el.querySelector('[ref="' + name + '"]');
	}

	/**
	 *
	 * @param {string} name - event name, is prefixed with constructed elements name and a double colon
	 * @param {object} detail - a custom detail for the CustomEvent
	 */
	emitEvent(name, detail = {}) {
		name = this.constructor.name + '::' + name;
		let hasEvent = name in this.__evts;
		if (!hasEvent) {
			this.__evts[name] = new CustomEvent(name, {
				bubbles: true,
				detail,
			});
		}

		document.dispatchEvent(this.__evts[name]);
	}

	/**
	 *
	 * @param {string} selector - optional string for selector
	 * @returns {any}
	 */
	onBeforeConstructCallback(selector = '') {}

	/**
	 * onConstructCallback
	 *
	 * @param {unknown} beforeConstructCallbackResults - meant to be entirely optional and is undefined unless you use beforeConstructCallback
	 */
	onConstructCallback(beforeConstructCallbackResults = null) {}
}
