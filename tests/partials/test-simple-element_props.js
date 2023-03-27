export const propsTest = (css, html, SimpleElement) => {
  class TestProps extends SimpleElement {
    styles = css``;
    markup = html``;
    properties = {
      bool: { type: Boolean },
      str: { type: String },
      num: { type: Number },
      obj: { type: Object },
    };
    constructor() {
      super();
      this.render();
    }
  }
  customElements.define("test-props", TestProps);

  describe("Sets and Gets all properties, according to their types", () => {
    const tp = new TestProps();

    test("bool prop is set and unset and is of type boolean", () => {
      expect(tp.bool).toBe(false);
      tp.bool = true;
      expect(tp.bool).toBe(true);
      expect(typeof tp.bool).toBe("boolean");

      tp.bool = false;
      expect(tp.bool).toBe(false);

      tp.bool = "sam";
      expect(tp.bool).toBe(true);
    });

    test("String prop is set and unset and is of type String", () => {
      expect(tp.str).toBe(null);

      tp.str = "str";
      expect(tp.str).toBe("str");
      expect(typeof tp.str).toBe("string");

      tp.str = 123;
      expect(tp.str).toBe("123");

      tp.str = undefined;
      expect(tp.str).toBe(null);
    });

    test("number prop is set and unset and is of type Number", () => {
      expect(tp.num).toBe(NaN);

      tp.num = 1;
      expect(tp.num).toBe(1);
      expect(typeof tp.num).toBe("number");

      tp.num = 1.23;
      expect(tp.num).toBe(1.23);
      expect(typeof tp.num).toBe("number");

      tp.num = "billy";
      expect(tp.num).toBe(NaN);

      tp.num = "123";
      expect(tp.num).toBe(123);

      tp.num = {
        valueOf: () => {
          throw new Error();
        },
      };
      expect(tp.num).toBe(NaN);

      tp.num = undefined;
      expect(tp.num).toBe(NaN);
    });

    test("Object prop is set and unset and is of type Object", () => {
      expect(tp.obj).toBe(null);

      const o = { prop: "prop" };
      tp.obj = o;
      expect(JSON.stringify(tp.obj)).toBe(JSON.stringify(o));
      expect(tp.obj.prop).toBe(tp.obj.prop);
      expect(typeof tp.obj).toBe("object");

      tp.obj = '{"prop": "prop"}';
      expect(tp.obj.prop).toBe("prop");

      tp.obj = '["one","two"]';
      expect(tp.obj[0]).toBe("one");

      tp.obj = [1, 2];
      expect(tp.obj[0]).toBe(1);

      tp.obj = undefined;
      expect(tp.obj).toBe(null);
    });

    test("Errors are handled if a prop is used that wasn't defined", () => {
      expect(tp.none).toBe(undefined);
    });
  });
  return true;
};
