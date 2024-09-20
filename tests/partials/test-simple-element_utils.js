export const utilityTest = (css, html) => {
  test("Utility Functions return what was passed in", () => {
    const two = "two";
    const four = 4;
    const control = `one ${two} three ${four}`;
    const style = css`one ${two} three ${four}`;
    const markup = html`one ${two} three ${four}`;
    expect(style).toBe(control);
    expect(markup).toBe(control);
  });

  return true;
};
