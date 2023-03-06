/**
 * @summary Layout Loading
 */

import { $ } from "./index.js";
import { addButtonListeners, cloneTemplate, editLayoutTitle } from "./layout-editing.js";

const layouts = {
  newFromScratch: "defaultNewLayout",
};

/** @param {string} targetLayout */
export function loadLayout(targetLayout) {
  const layout = cloneTemplate(layouts[targetLayout]);
  layout && $("#layoutEditor")?.appendChild(layout);
  addButtonListeners();

  // Setup listener for Layout Title change
  $("#layoutTitle")?.addEventListener("click", editLayoutTitle);
}

// TODO: Layout Loading - From Template
