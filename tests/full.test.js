import { css, html, SimpleElement } from "../simple-element.js";
import { observerTest } from "./partials/test-simple-element_observe.js";
import { elementsTest } from "./partials/test-simple-element_elements.js";
import { propsTest } from "./partials/test-simple-element_props.js";
import { utilityTest } from "./partials/test-simple-element_utils.js";

observerTest(css, html, SimpleElement);
elementsTest(css, html, SimpleElement);
propsTest(css, html, SimpleElement);
utilityTest(css, html);
