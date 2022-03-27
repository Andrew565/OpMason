/**
 * @summary Layout Loading
 */

import { $, cloneTemplate } from ".";
import { addButtonListeners, editLayoutTitle } from "./layout-editing";

const layouts = {
  newFromScratch: "defaultNewLayout",
};

/** @param {string} targetLayout */
export function loadLayout(targetLayout) {
  const layout = cloneTemplate(layouts[targetLayout]);
  $("#layoutEditor").appendChild(layout);
  addButtonListeners();

  // Setup listener for Layout Title change
  $("#layoutTitle").addEventListener("click", editLayoutTitle);
}

// TODO: Layout Loading - From Template
