// Taken from uhooks/esm
let info = null, schedule = new Set;

const runSchedule = () => {
	const previous = schedule;
	schedule = new Set;
	previous.forEach(({ h, c, a, e }) => {
		// avoid running schedules when the hook is
		// re-executed before such schedule happens
		if (e)
			h.apply(c, a);
	});
};

export const getInfo = () => info;

// export const isFunction = f => typeof f === 'function';

export const reschedule = info => {
	if (!schedule.has(info)) {
		info.e = 1;
		schedule.add(info);
		wait.then(runSchedule);
	}
};

const getValue = (value, f) => typeof f === 'function' ? f(value) : f;

export const useReducer = (reducer, value, init) => {
	const info = getInfo();
	const { i, s } = info;
	if (i === s.length)
		s.push({
			$: typeof init === 'function' ?
				init(value) : getValue(void 0, value),
			set: value => {
				s[i].$ = reducer(s[i].$, value);
				reschedule(info);
			}
		});
	const { $, set } = s[info.i++];
	return [$, set];
};

export const wait = new Promise($ => $())

export const useState = value => useReducer(getValue, value);
