// @ts-check

import { useState } from './hook';

// creates a pseudo private state map, can still be accessed, its just a hassle to do so.
const __internal_state_map = Symbol('__internal_state_map');

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

		this.useState = useState
		this.__evts = {};

		this.onConstructCallback(onBeforeConstructCallbackResults);
		this.emitEvent('Constructed');

		/** @type {HTMLElement} */
		this.el = null;
	}

	get __internal_state() {
		// use the previously defined symbol to access the map, hiding it behind the symbol
		if (!this[__internal_state_map]) this[__internal_state_map] = new Map();

		return this[__internal_state_map];
	}

	/*
	 *  // set the id of the state you are setting equal
	 *  // to the name of the variable in the first item
	 *  // of the destructured array
	 *	const [count, setCount] = this.useState('count', 0);
	 *
	 *  // This will make it easier to track when debugging
	 */
	/**
	 *
	 * @param {string} id - state key, should be same as variable
	 * @param {unknown} initialState - starting state, can be anything but will be changed by callback in return[1]
	 */
	useState(id, initialState) {
		// set the initial state as current internal state
		let currentInternalState = this.__internal_state
			.set(id, initialState)
			.get(id);

		// create the setStateCallback
		const setStateCallback = updatedStateOrCallback => {
			// check if the argument is a new state or a callback
			let updatedState =
				{}.toString.call(updatedStateOrCallback) === '[object Function]'
					? updatedStateOrCallback(this.__internal_state.get(id))
					: updatedStateOrCallback;

			// then set the new state and return the updated state
			return this.__internal_state.set(id, updatedState).get(id);
		};

		// then return the new internal state and call back
		return [currentInternalState, setStateCallback];
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
			template: document.importNode(
				// @ts-ignore
				this.constructor.template.content,
				true
			),
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
	onBeforeConstructCallback(selector = '') { }

	/**
	 * onConstructCallback
	 *
	 * @param {unknown} beforeConstructCallbackResults - meant to be entirely optional and is undefined unless you use beforeConstructCallback
	 */
	onConstructCallback(beforeConstructCallbackResults = null) { }
}
