const out = (strings, ...args) =>
  strings.map((str, i) => `${str}${args[i] || ""}`).join("");
export const html = (strings, ...args) => out(strings, args);
export const css = (strings, ...args) => out(strings, args);

const buildShadowRoot = (html, elem) => {
  const template = document.createElement("template");
  template.innerHTML = html;
  const shadowRoot = elem.attachShadow({ mode: `open` });
  shadowRoot.appendChild(template.content.cloneNode(true), true);
  return shadowRoot;
};

export class SimpleElement extends HTMLElement {
  styles = "";
  markup = "";
  properties = {};
  elements = {};
  selectors = {};
  mutationOptions = { attributes: true, childList: true, subtree: true };

  constructor() {
    super();
  }
  setProperties() {
    Object.entries(this.properties).forEach(([key, v]) => {
      let conf = {
        get() {
          return this.getAttribute(key);
        },
        set(val) {
          if (!!val) this.setAttribute(key, val);
          else this.removeAttribute(key);
        },
      };

      if (v.type === Boolean) {
        conf = {
          get() {
            return this.hasAttribute(key);
          },
          set(val) {
            if (!!val) this.setAttribute(key, "");
            else this.removeAttribute(key);
          },
        };
      }

      if (v.type === Number) {
        conf = {
          get() {
            return parseFloat(this.getAttribute(key));
          },
          set(val) {
            if (!!val || val === 0) this.setAttribute(key, val);
            else this.removeAttribute(key);
          },
        };
      }

      if (v.type === Object) {
        conf = {
          get() {
            return JSON.parse(this.getAttribute(key));
          },
          set(val) {
            if (!!val) {
              if (typeof val === "string") this.setAttribute(key, val);
              else this.setAttribute(key, JSON.stringify(val));
            } else this.removeAttribute(key);
          },
        };
      }
      Object.defineProperty(this, key, conf);
    });
  }
  setElements(root) {
    Object.entries(this.selectors).forEach(([key, obj]) => {
      const elem = root.querySelector(obj.selector);
      this.elements[key] = elem;
      if (obj.event) elem.addEventListener(obj.event, obj.handler);
    });
  }
  render(options) {
    this.setProperties();
    const root = buildShadowRoot(
      `<style>${this.styles}</style>${this.markup}`,
      this
    );
    if (options?.observe) {
      this.observer = this.watchChildren();
      this.updateChildren();
    }
    this.setElements(root);
    return root;
  }

  watchChildren() {
    let observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        this.updateChildren(mutation);
      });
    });

    observer.observe(this, this.mutationOptions);
    return observer;
  }

  updateChildren(mutation) {
    this.observer.disconnect();
    this.handleMutation(mutation);
    this.observer.observe(this, this.mutationOptions);
  }

  handleMutation(mutation) {}
}
