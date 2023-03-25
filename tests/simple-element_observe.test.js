import { css, html, SimpleElement } from "../simple-element.js";
import { jest } from "@jest/globals";
import { waitFor } from "@testing-library/dom";

class TestObserve extends SimpleElement {
  styles = css``;
  markup = html`<section></section>`;
  selectors = {
    container: { selector: "section" },
  };
  constructor() {
    super();
    this.render({ observe: true });
  }
  handleMutation(mutation) {
    if (this.elements.container) {
      [...this.elements.container?.children].forEach((child) => child.remove());
      [...this.children].forEach((child, i) => {
        if (child.localName === "em") {
          this.elements.container?.appendChild(child.cloneNode(true));
        }
      });
    }
  }
}
customElements.define("test-observe", TestObserve);

describe("Listens for child mutations and updates the shadow dom", () => {
  const to = new TestObserve();
  ["I", "am", "not", "amazing"].forEach((text) => {
    let el = "em";
    if (text === "not") el = "span";
    const elem = document.createElement(el);
    elem.textContent = text;
    to.appendChild(elem);
  });
  test("listens for mutations to the dom tree", () => {
    expect(to.elements.container.children.length).toBe(3);
  });
  test("listens for mutation on props", async () => {
    to.children[0].classList.add("hi");
    await waitFor(() =>
      expect(to.elements.container.children[0].classList.contains("hi")).toBe(
        true
      )
    );
  });
});
