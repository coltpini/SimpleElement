# SimpleElement
Simple Element is a convenience Class for Custom Elements. It adds functions around simpler property getter and setters, element selectors for manipulation through native element functions, and simple mutation observer for dom manipulation reactions.

## Examples

### Basic

At it's very simplest form you can create a custom element like this:
```
import {html, css, SimpleElement } from 'SimpleElement';

class MyElement extends SimpleElement {
  styles = css`:host[blue]{ color: blue;}`;
  markup = html`<slot></slot>`;

  properties = {
    blue: {type: Boolean}
  };

  constructor(){
    super();
    this.render();
  }
}
customElements.define("my-element", MyElement);
```
### observed property

That is useful, but typically you are going to want more functionality, so adding more properties to react to will give you more functionality. That is done mostly through native functionality, but we have a selectors helper that will help in making DOM changes in the shadow dom. From the selectors there is an object to access the selected elements `this.elements` that can access the element with the key used in the selectors object.
```
import {html, css, SimpleElement } from 'SimpleElement';

class MyElement extends SimpleElement {
  styles = css`
    :host[blue]{
      color: blue;
    }
  `;
  markup = html`
    <em></em>
    <slot></slot>
  `;

  properties = {
    blue: {type: Boolean},
    prefix: {type: String}
  };
  selectors = {
    // defining the selector here
    prefix: {selector: 'em'}
  };

  constructor(){
    super();
    this.render();
  }

  static get observedAttributes() {
    return ["prefix"];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    // using the `this.elements` object to access the prefix selected element
    if (attrName === "prefix") this.elements.prefix.textContent = newVal;
  }
}
customElements.define("my-element", MyElement);
```
### event listener on elements
Sometimes you want to be able to add event listeners on your elements, we have a simple helper in the selector object to help with that.

```
import {html, css, SimpleElement } from 'SimpleElement';

class MyElement extends SimpleElement {
  styles = css`
    :host[blue]{
      color: blue;
    }
  `;
  markup = html`
    <em></em>
    <slot></slot>
    <button>Poke!</button>
  `;

  properties = {
    blue: {type: Boolean},
    prefix: {type: String}
  };
  selectors = {
    prefix: {selector: 'em'},
    button: {
      selector: 'button',
      event: 'click',
      handler: this.handleClick.bind(this)
    }
  };

  constructor(){
    super();
    this.render();
  }

  static get observedAttributes() {
    return ["prefix"];
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === "prefix") this.elements.prefix.textContent = newVal;
  }

   handleClick(e) {
    // we can use the custom element API here to dispatch an internal
    // event from the custom elements
    this.dispatchEvent(
      new CustomEvent("poked", {
        bubbles: true,
        // composed is important for events from inside a shadow dom
        // being dispatched outside.
        composed: true,
      })
    );
  }
}
customElements.define("my-element", MyElement);
```

### Mutation Observer
Sometimes you need to use the tree from the light DOM to influence the Shadow DOM, for example, if you have option elements inside a custom selection component. You don't want the options to render in the light DOM, but want the API of sending options through the DOM tree.

```
import {html, css, SimpleElement } from 'SimpleElement';

class MyElement extends SimpleElement {
  styles = css`:host[blue]{ color: blue;}`;
  markup = html`
    <select></select>
  `;

  selectors = {
    select: {
      selector: 'select',
      event: 'changed',
      handler: this.handleChange.bind(this)
    }
  };

  constructor(){
    super();
    this.render({observe: true});
  }

  // use this function to handle any mutation in the light DOM
  // mutation is a MutationRecord (https://dom.spec.whatwg.org/#mutationrecord)
  handleMutation(mutation){
    [...this.elements.select.children].forEach(child => child.remove());
    [...this.children].forEach((child, i) => {
      if (!this.value && i === 0) {
        this.value = child.value || child.textContent;
      }
      if (child.localName === 'option') {
        this.elements.select.appendChild(child.cloneNode(true));
      }
    });
  }

  handleChange(e){
    this.dispatchEvent(
      new CustomEvent("change", {
        detail: this.value,
        bubbles: true,
        composed: true,
      })
    );
  }

}
customElements.define("my-element", MyElement);
```

This than can be used like this:
```
<my-element>
  <option>Option 1</option>
  <option>Option 2</option>
</my-element>
```