const screens = document.getElementsByTagName("main");

const dialogButtons = document.querySelectorAll(".dialog button");
dialogButtons.forEach((btn) => {
  btn.addEventListener("click", switchToEditor);
});

/** @type {EventListener} */
function switchToEditor(e) {
  const targetLayout = /** @type {HTMLButtonElement} */ (e.target).dataset.target;
  for (let screen of screens) makeInvisible(screen);
  const editLayoutScreen = document.getElementById("editLayout");
  editLayoutScreen.classList.add("visible");
  loadLayout(targetLayout);
}

/** @param {HTMLElement} screen */
function makeInvisible(screen) {
  screen.classList.remove("visible");
}

const layouts = {
  newFromScratch: "defaultNewLayout",
};

function loadLayout(/** @type {string} */ targetLayout) {
  const layout = getLayout(layouts[targetLayout]);
  document.getElementById("layoutEditor").appendChild(layout);
  addButtonListeners();
}

/** @param {string} layoutID */
function getLayout(layoutID) {
  const template = /** @type {HTMLTemplateElement} */ (document.getElementById(layoutID));
  return template.content.firstElementChild.cloneNode(true);
}
