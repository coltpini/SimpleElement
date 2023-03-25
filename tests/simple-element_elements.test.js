import { css, html, SimpleElement } from "../simple-element.js";
import { jest } from "@jest/globals";
import { waitFor } from "@testing-library/dom";

class TestElements extends SimpleElement {
  styles = css``;
  markup = html`
    <span>span</span>
    <em>em</em>
  `;
  selectors = {
    span: { selector: "span" },
    event: {
      selector: "em",
      event: "click",
      handler: this.handleClick.bind(this),
    },
  };
  constructor() {
    super();
    this.render();
  }
  handleClick(e) {
    this.dispatchEvent(
      new CustomEvent("test-event", {
        detail: "hi",
        bubbles: true,
        composed: true,
      })
    );
  }
}
customElements.define("test-elements", TestElements);

describe("Selects elements from the shadow dom, makes them available in the elements object and assigns events to them.", () => {
  const te = new TestElements();
  test("Element is selected from the shadow dom and available in the elements object", () => {
    expect(te.elements.span.textContent).toBe("span");
    expect(te.elements.event.textContent).toBe("em");
  });
  test("events fire and handlers are attached.", async () => {
    const mock = jest.fn();
    te.addEventListener("test-event", mock);
    te.elements.event.click();
    await waitFor(() => expect(mock).toHaveBeenCalledTimes(1));
  });
});
