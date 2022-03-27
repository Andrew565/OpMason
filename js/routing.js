/**
 * @summary Routing
 */

import { $, screens } from ".";
import { loadLayout } from "./layout-loading";

const dialogButtons = document.querySelectorAll(".dialog button");
dialogButtons.forEach((btn) => {
  btn.addEventListener("click", switchToEditor);
});

/** @type {EventListener} */
function switchToEditor(e) {
  const targetLayout = /** @type {HTMLButtonElement} */ (e.target).dataset.target;
  screens.forEach(makeInvisible);
  const editLayoutScreen = $("#editLayout");
  editLayoutScreen.classList.add("visible");
  loadLayout(targetLayout);
}

/** @param {Element} screen */
function makeInvisible(screen) {
  screen.classList.remove("visible");
}

