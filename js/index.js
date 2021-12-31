/**
 * @typedef {{kind: string; quantity: undefined | string}} ModObj
 * @typedef {(opt?: string | string[]) => string} MasonComponent
 */

// General Setup

const screens = document.getElementsByTagName("main");
const slotTypes = ["deck", "spacer", "foundation", "waste"];
const newLayout = { title: "Untitled Document", rows: {} };

// Routing

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

// Layout Loading

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
  titleInput: () => String.raw`
    <input type="text" id="newLayoutTitle" value="${newLayout.title}" />
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
    const addRowEl = document.querySelector(".addRow");
    addRowEl.insertAdjacentElement("beforebegin", newEl);
  }
}

function addButtonListeners() {
  const addButtons = document.querySelectorAll(".addButton");
  addButtons.forEach((btn) => {
    btn.addEventListener("click", addThing);
  });
}

// Layout Editing - Updating

function addSlotListeners() {
  const slots = document.querySelectorAll(".slot:not(.addSlot)");
  slots.forEach((slotEl) => {
    slotEl.addEventListener("click", showSlotEditor);
  });
}

/** @type {EventListener} */
function showSlotEditor(e) {
  // Init vars
  const slotEl = /** @type {HTMLElement} */ (e.target);
  const slotType = getSlotType(slotEl);
  const modifiers = getMods(slotEl);
  const slotEditorTemplate = /** @type {HTMLTemplateElement} */ (document.getElementById("slotEditorTemplate"));
  const newSlotEditor = slotEditorTemplate.content.firstElementChild.cloneNode(true);

  // Attach to DOM
  document.getElementById("editLayout").appendChild(newSlotEditor);
  const newSlotEditorEl = document.getElementById("slotEditor");

  // TODO: Setup listener for Layout Title change
  document.getElementById("editLayoutTitle").addEventListener("click", () => {
    // Remove the 'editLayoutTitle' button
    // Attach components.newLayoutTitle
    // Add event listener to nLT 'save' button
    // // Revert to 'editLayoutTitle' button after new title saved
  });

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
  const layout = document.getElementById("layoutEditor").firstElementChild;
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
