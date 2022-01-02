/**
 * @typedef {HTMLElement & {addC: typeof DOMTokenList.prototype.add, remC: typeof DOMTokenList.prototype.remove,hasC: typeof DOMTokenList.prototype.contains, toggleC: typeof DOMTokenList.prototype.toggle}} CustomSelectorElement
 * @typedef {{kind: string; quantity: undefined | string}} ModObj
 * @typedef {(opt?: string | string[]) => string} MasonComponent
 */

// General Setup

const addClassHandlers = (/** @type {CustomSelectorElement} */ el) => {
  el.addC = el.classList.add;
  el.remC = el.classList.remove;
  el.hasC = el.classList.contains;
  el.toggleC = el.classList.toggle;
  return el;
};

const $ = (/** @type {string} */ selector) => {
  /** @type {CustomSelectorElement} */
  let el = document.querySelector(selector);
  return addClassHandlers(el);
};
const $$ = (/** @type {string} */ selector) => {
  let els = /** @type {CustomSelectorElement[]} */ (Array.from(document.querySelectorAll(selector)));
  return els.map(addClassHandlers);
};
const screens = $$("main");
const slotTypes = ["deck", "spacer", "foundation", "waste"];

function createNewLayout() {
  return { title: "Untitled Document", rows: {} };
}
const newLayout = createNewLayout();

function cloneTemplate(/** @type {string} */ tmplId) {
  const template = /** @type {HTMLTemplateElement} */ (/** @type {unknown} */ ($(`#${tmplId}`)));
  return template.content.firstElementChild.cloneNode(true);
}

// Routing

const dialogButtons = $$(".dialog button");
dialogButtons.forEach((btn) => {
  btn.addEventListener("click", switchToEditor);
});

/** @type {EventListener} */
function switchToEditor(e) {
  const targetLayout = /** @type {HTMLButtonElement} */ (e.target).dataset.target;
  screens.forEach(makeInvisible);
  const editLayoutScreen = $("#editLayout");
  editLayoutScreen.addC("visible");
  loadLayout(targetLayout);
}

/** @param {CustomSelectorElement} screen */
function makeInvisible(screen) {
  screen.remC("visible");
}

// Layout Loading

const layouts = {
  newFromScratch: "defaultNewLayout",
};

/** @param {string} targetLayout */
function loadLayout(targetLayout) {
  const layout = cloneTemplate(layouts[targetLayout]);
  $("#layoutEditor").appendChild(layout);
  addButtonListeners();
}

// TODO: Layout Loading - From Template

// Layout Editing - Adding

/** @type {{[x: string]: MasonComponent}} */
const components = {
  slot: (mods = ["slot"]) => Array.isArray(mods) && mods.map(components.modSpan).join(String.raw`<br>`),
  row: () => String.raw`
    <div class="slot">
      <button class="addButton" data-add-type="slot">+ Slot</button>
    </div>
  `,
  modSpan: (mod) => String.raw`<span class="${mod}">${mod}</span>`,
};

/** @type {EventListener} */
function addThing(e) {
  const target = /** @type {HTMLButtonElement} */ (e.target);

  const thingToAdd = target.dataset.addType;
  const newThing = components[thingToAdd]();
  const newEl = document.createElement("div");
  newEl.classList.add(thingToAdd);
  newEl.innerHTML = newThing;

  if (thingToAdd === "slot") {
    const parent = target.parentNode.parentNode;
    parent.prepend(newEl);
  } else {
    const addRowEl = $(".addRow");
    addRowEl.insertAdjacentElement("beforebegin", newEl);
  }
}

function addButtonListeners() {
  const addButtons = $$(".addButton");
  addButtons.forEach((btn) => {
    btn.addEventListener("click", addThing);
  });
}

// Layout Editing - Updating

function addSlotListeners() {
  const slots = $$(".slot:not(.addSlot)");
  slots.forEach((slotEl) => {
    slotEl.addEventListener("click", showSlotEditor);
  });
}

/** @type {EventListener} */
function saveLayoutTitle(e) {
  // TODO: This
}

/** @type {EventListener} */
function editLayoutTitle(e) {
  // Make the 'layoutTitle' h1 invisible
  const h1 = $("#layoutTitle");
  h1.addC("hide");

  // Make layout title input visible
  const titleEditor = $("#layoutTitleEditor");
  titleEditor.addC("hide");

  // Add event listener to 'save' button
  const saveBtn = $("#saveEditedLayoutTitle");
  saveBtn.addEventListener("click", saveLayoutTitle);

  // Revert to 'layoutTitle' h1 after new title saved
  h1.remC("hide");
}

/** @type {EventListener} */
function showSlotEditor(e) {
  // Init vars
  const slotEl = /** @type {HTMLElement} */ (e.target);
  const slotType = getSlotType(slotEl);
  const modifiers = getMods(slotEl);
  const newSlotEditor = cloneTemplate("slotEditorTemplate");

  // Attach to DOM
  $("#editLayout").appendChild(newSlotEditor);
  const newSlotEditorEl = $("#slotEditor");

  // Setup listener for Layout Title change
  $("#editLayoutTitle").addEventListener("click", editLayoutTitle);

  // Set pre-existing options
  const slotTypeOption = /** @type {HTMLOptionElement} */ (
    newSlotEditorEl.querySelector(`option[value="${slotType}"]`)
  );
  slotTypeOption.selected = true;

  // Set pre-existing modifiers (if any)
  if (modifiers.length > 0) {
    newSlotEditorEl.dataset.modifiers = modifiers.map((mod) => mod.kind).join(",");

    const limited = modifiers.find((mod) => mod.kind === "limited");
    if (limited) {
      newSlotEditorEl.dataset.limit = limited.quantity;
    }
  }
}

/**
 * @param {HTMLElement} target
 * @param {string} mod
 */
function addModifier(target, mod) {
  if (slotTypes.includes(mod)) {
    target.classList.add(mod);
  } else {
    target.dataset.modifiers = `${mod},${target.dataset.modifiers}`;
  }
}

/**
 * @param {HTMLElement} target
 * @param {string} mod
 */
function removeModifier(target, mod) {
  if (slotTypes.includes(mod)) {
    target.classList.remove(mod);
  } else {
    target.dataset.modifiers.includes(mod) && target.dataset.modifiers.replace(mod, "");
  }
}

// TODO: Layout Editing - Removing

// Layout Editing - Saving
function saveLayout() {
  const layoutObj = { rows: [] };
  const layout = $("#layoutEditor").firstElementChild;
  const rows = layout.querySelectorAll(".row:not(.addRow)");

  rows.forEach((row) => {
    const rowArr = [];

    /** @type {NodeListOf<HTMLElement>} */
    const slots = row.querySelectorAll(".slot:not(.addSlot)");
    slots.forEach((slot) => {
      const slotType = getSlotType(slot);
      const modifiers = getMods(slot);
      const slotObj = { slotType, modifiers };

      rowArr.push(slotObj);
    });

    layoutObj.rows.push(rowArr);
  });

  const finalLayout = JSON.stringify(layoutObj);
  console.log("Layout:");
  console.log(finalLayout);
  alert("Layout printed out in console.");

  // TODO: display and/or write to a file the layoutObj
}

/** @param {HTMLElement} slot */
function getSlotType(slot) {
  let slotType = "SLOT";
  if (slot.classList.length > 1) {
    const classes = slot.classList;
    classes.remove("slot");
    slotType = classes.item(0).toUpperCase();
  }
  return slotType;
}

/**
 * @param {HTMLElement} slot
 * @returns {ModObj[]}
 */
function getMods(slot) {
  const modifiers = [];
  if ("modifiers" in slot.dataset) {
    const mods = slot.dataset.modifiers.split(",");
    mods.forEach((mod) => {
      const modObj = { kind: mod, quantity: undefined };
      if (mod === "limited") modObj.quantity = slot.dataset.limit;
      modifiers.push(modObj);
    });
  }
  return modifiers;
}
