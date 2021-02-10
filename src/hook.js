// @ts-check
// Taken from uhooks/esm
let info = null, schedule = new Set;

/**
 * @param {function} callback 
 */
export const hooked = callback => {
	const current = { h: hook, c: null, a: null, e: 0, i: 0, s: [] };
	return hook;

	function hook() {
		const prev = info;
		info = current;
		current.e = current.i = 0;
		try {
			return callback.apply(current.c = this, current.a = arguments);
		}
		finally {
			info = prev;
		}
	}
};

const runSchedule = () => {
	const previous = schedule;
	schedule = new Set;
	previous.forEach(
		/**
		 * @param {object} param
		 * @param {function} param.h
		 * @param {function} param.c
		 * @param {object} param.a
		 * @param {number} param.e
		 */
		({ h, c, a, e }) => {
			// avoid running schedules when the hook is
			// re-executed before such schedule happens
			if (e)
				h.apply(c, a);
		});
};
/**
 * @returns {({
 * 	i: number,
 * 	s: array,
 * 	h: function,
 * 	c: function,
 * 	a: object,
 * 	e: number
 * })}
 */
export const getInfo = () => info;

// export const isFunction = f => typeof f === 'function';

/**
 * @param {({e:number})} info
 */
export const reschedule = info => {
	if (!schedule.has(info)) {
		info.e = 1;
		schedule.add(info);
		wait.then(runSchedule);
	}
};

/**
 * @param {unknown} value 
 * @param {Function|unknown} f 
 */
const getValue = (value, f) => typeof f === 'function' ? f(value) : f;

/**
 * @param {function} reducer 
 * @param {any} value 
 * @param {any} init 
 */
export const useReducer = (reducer, value, init) => {
	const info = getInfo();
	const { i, s } = info;
	if (i === s.length)
		s.push({
			$: typeof init === 'function' ?
				init(value) : getValue(void 0, value),
			/**
			 * @param {unknown} value 
			 */
			set: value => {
				s[i].$ = reducer(s[i].$, value);
				reschedule(info);
			}
		});
	const { $, set } = s[info.i++];
	return [$, set];
};

export const wait = new Promise($ => $())

/**
 * @param {any} value 
 */
export const useState = value => useReducer(getValue, value);
