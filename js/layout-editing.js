/**
 * @summary Layout Editing
 */

import { $, getMods, getSlotType } from "./index.js";

export function createNewLayout() {
  return { title: "Untitled Document", rows: [] };
}

export function cloneTemplate(/** @type {string} */ templateId) {
  const template = /** @type {HTMLTemplateElement} */ ($(`#${templateId}`));
  return template.content.firstElementChild?.cloneNode(true);
}

let currentLayout = createNewLayout();

/**
 * @summary Layout Editing - Title
 */

/** @type {EventListener} */
function saveLayoutTitle() {
  const titleInput = /** @type {HTMLInputElement} */ ($("#editedLayoutTitle"));
  const newTitle = titleInput.value;
  currentLayout.title = newTitle;
  const titleEl = /** @type {HTMLElement} */ ($("#editLayoutTitle"));
  titleEl.innerText = newTitle;

  // Revert to 'layoutTitle' h1 after new title saved
  const titleEditor = $("#layoutTitleEditor");
  titleEditor?.classList.add("hide");
  const h1 = $("#layoutTitle");
  h1?.classList.remove("hide");
}

/** @type {EventListener} */
export function editLayoutTitle() {
  // Make the 'layoutTitle' h1 invisible
  const h1 = $("#layoutTitle");
  h1?.classList.add("hide");

  // Make layout title input visible
  const titleEditor = $("#layoutTitleEditor");
  titleEditor?.classList.remove("hide");

  // Add event listener to 'save' button
  const saveBtn = $("#saveEditedLayoutTitle");
  saveBtn?.addEventListener("click", saveLayoutTitle);
}

/**
 * @summary Layout Editing - Adding
 */

/** @type {{[x: string]: import("./").MasonComponent}} */
const components = {
  slot: (mods = [""]) => {
    if (Array.isArray(mods)) {
      return mods.map(components.modSpan).join(String.raw`<br>`);
    } else {
      return mods;
    }
  },
  row: () => String.raw`
    <div class="slot addSlot">
      <button class="addButton" data-add-type="slot">+ Slot</button>
    </div>
  `,
  modSpan: (mod) => String.raw`<span class="${mod}">${mod}</span>`,
};

/** @type {EventListener} */
function addThing(e) {
  const target = /** @type {HTMLButtonElement} */ (e.target);
  const thingToAdd = target.dataset.addType;
  if (!thingToAdd) return;

  const newThing = components[thingToAdd]();
  const newEl = document.createElement("div");
  newEl.classList.add(thingToAdd);
  newEl.innerHTML = newThing;

  if (thingToAdd === "slot") {
    const parent = target.parentNode?.parentNode;
    parent?.prepend(newEl);
    addSlotListeners();
  } else {
    const addRowEl = $(".addRow");
    addRowEl?.insertAdjacentElement("beforebegin", newEl);

    const addSlotBtn = newEl.querySelector(".addButton");
    addSlotBtn?.addEventListener("click", addThing);
  }
}

export function addButtonListeners() {
  const addButtons = document.querySelectorAll(".addButton");
  addButtons.forEach((btn) => {
    btn.addEventListener("click", addThing);
  });
}

/**
 *  @summary Layout Editing - Updating
 */

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
  console.log("slotType:", slotType);
  const modifiers = getMods(slotEl);
  console.log("modifiers:", modifiers);
  const newSlotEditor = cloneTemplate("slotEditorTemplate");

  // Attach to DOM
  newSlotEditor && $("#editLayout")?.appendChild(newSlotEditor);
  const newSlotEditorEl = /** @type {HTMLElement} */ ($("#slotEditor"));

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
      newSlotEditorEl.dataset.limit = limited.quantity?.toString();
    }
  }

  // Enable cancel button (don't save changes)
  function cancelSlotEditing() {}

  $("#cancelSlotEditingButton")?.addEventListener("click", cancelSlotEditing);

  // TODO: Enable save button (save changes and update layout)
}

// TODO: Layout Editing - Removing

// Layout Editing - Saving
function saveLayout() {
  /** @type {{rows: import('./index').LAWSSlot[][]}} */
  const layoutObj = { rows: [] };
  const layout = $("#layoutEditor")?.firstElementChild;
  const rows = layout?.querySelectorAll(".row:not(.addRow)");

  rows &&
    rows.forEach((row) => {
      /** @type {import('./index').LAWSSlot[]} */
      const rowArr = [];

      /** @type {NodeListOf<HTMLElement>} */
      const slots = row.querySelectorAll(".slot:not(.addSlot)");
      slots.forEach((slot) => {
        const slotType = getSlotType(slot);
        const modifiers = getMods(slot);
        /** @type {import('./index').LAWSSlot} */
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

$("#saveLayout")?.addEventListener("click", saveLayout);
