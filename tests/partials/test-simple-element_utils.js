export const utilityTest = (css, html) => {
  test("Utility Functions return what was passed in", () => {
    const two = "two";
    const control = `one ${two} three`;
    const style = css`one ${two} three`;
    const markup = html`one ${two} three`;
    expect(style).toBe(control);
    expect(markup).toBe(control);
  });

  return true;
};
