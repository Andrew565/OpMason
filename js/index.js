/**
 * @summary General Setup
 */

/**
 * @typedef {{kind: string; quantity: undefined | string}} ModObj
 * @typedef {(opt?: string | string[]) => string} MasonComponent
 */

export const $ = (/** @type {string} */ selector) => document.querySelector(selector);
export const screens = document.querySelectorAll("main");
const slotTypes = ["deck", "spacer", "foundation", "waste"];

function createNewLayout() {
  return { title: "Untitled Document", rows: {} };
}

export function cloneTemplate(/** @type {string} */ templateId) {
  const template = /** @type {HTMLTemplateElement} */ ($(`#${templateId}`));
  return template.content.firstElementChild.cloneNode(true);
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

/** @param {HTMLElement} slot */
export function getSlotType(slot) {
  let slotType = "SLOT";
  if (slot.classList.length > 1) {
    const classes = slot.classList;
    classes.remove("slot");
    slotType = classes.item(0).toUpperCase();
  }
  return slotType.toLowerCase();
}

/**
 * @param {HTMLElement} slot
 * @returns {ModObj[]}
 */
export function getMods(slot) {
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
