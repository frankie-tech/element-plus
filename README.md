# ElementPlus - A special utility class *stretching* the HTMLElement


## Documentation

**Basic Example**


```html
<aside id="myModal">
	<div class="modal-container">
		<header class="modal-header" data-ref="header">
			<h1>Modal Header</h1>
		</header>
		<main class="modal-body" data-ref="body">
			<p>...</p>
		</main>
		<footer class="modal-footer" data-ref="footer">
			<ul>
				<li>...</li>
			</ul>
		</footer>
	</div>
</aside>
```

```js
class ModalPlus extends ElementPlus {
	constructor(element, props) {
		super(element, props);
		
		this.isOpen = false;
	}
	
	open() {
		if (this.isOpen) return;
		
		this.el.classList.add('open');
		document.classList.add('modal-open');
		requestAnimationFrame(() => {
			this.refs.header.classList.add('fade-in', 'fade-in-1');
			this.refs.body.classList.add('fade-in', 'fade-in-2');
			this.refs.footer.classList.add('fade-in', 'fade-in-3');
		});
		
		this.emitEvent('open');
	}
	
	close() {
		if (!this.isOpen) return;
		
		this.el.classList.remove('open');
		document.classList.remove('modal-open');
		
		this.refs.header.classList.remove('fade-in', 'fade-in-1');
		this.refs.body.classList.remove('fade-in', 'fade-in-2');
		this.refs.footer.classList.remove('fade-in', 'fade-in-3');
		
		this.emitEvent('close');
	}
}

// accepts either an element
// or a valid query selector string
const myModal = new ModalPlus('#myModal');

myModal.open();
```


**References**

Any child of the element passed into the constructor can have the `data-ref` attribute, and it will be available inside the class as `this.refs.${value}`.

This can be helpful for sectioning off components like a modal. If you need to target multiple references, prefix the value with a dollar sign, and it will return an Array of references instead.


```html
<ul id="myListOfChildren">
	<li data-ref="childName">Jack</li>
	<li data-ref="childBirthday">12/24/1000</li>
	<li data-ref="childName">Jane</li>
	<li data-ref="childBirthday">01/01/0001</li>
	<li data-ref="childName">Jill</li>
</ul>
```

```js
class ListPlus extends ElementPlus {
	constructor(element, props) {
		super(element, props);
		
		this.names = this.refs.$childNames; // [ li{Jack}, li{Jane}, li{Jill} ]
		this.firstBirthday = this.refs.childBirthday; // li{12/24/1000}
	}
}
```


**Easy Custom Events**

Custom Events come built in. You can define the event prefix by adding `eventPrefix` to the `props` object in the second argument, but it will default to `this.constructor.name.toLowerCase()`.

To dispatch a custom event, use `ElementPlus.dispatchEvent`:

```js
class AccordionPlus extends ElementPlus {
	constructor(element, props);
		super(element, props);
	}
	
	expand(target) {
		// Expand your AccordionPlus
		this.dispatchEvent('expand', {
			element: this.el,
			accordionSection: target
		});
	}
}

const myAccordion = new AccordionPlus('#myAccordion', { eventPrefix: 'accordion' });

myAccordion.addEventListener('accordion:expand', console.log) // CusomEvent(/* */)
```


**Simple Templating**

While ElementPlus doesn't have the niceties of the ShadowDOM or Scoped Styling, it does come with its own template HTML option.

To use this, simply replace the base `static get template HTML()`  method to return your own template string.


```js

class ComplexListPlus extends ElementPlus {
	constructor(element, props) {
		super(element, props);
		this.el.classList.add('list-items-loading');
		this.getListItems()
			.then(() => this.el.classList.add('list-items-loaded'))
			.catch(() => this.el.classList.add('list-items-error'))
			.then(() => this.el.classList.remove('list-items-loading'));
	}
	
	static get templateHTML() {
		return `
			<li data-ref="listItemContainer" class="list-item-container">
				<span class="list-item-title"></span>
				<span class="list-item-body"></span>
				<span class="list-item-footer">
					<ul data-ref="listItemContainerNav" class="list-item-container-nav">
						<li>...</li>
					</ul>
				</span>
			</li>
		`;
	}
	
	async getListItems() {
		// this will retrieve a <template> element from the ComplexListPlus class
		const tpl = () => this.constructor.template.content.cloneNode();
		
		// this will retrieve the HTML string from the ComplexListPlus class
		const html = this.constructor.templateHTML;
		
		const results = await fetch(...);
		
		const json = await result.json();
		
		requestAnimationFrame(() => {
			json.forEach(arrayItem => {
				const content = tpl();

				/*
					insert data
				*/

				this.el.append(content);
			})
		});
	}
}
```



