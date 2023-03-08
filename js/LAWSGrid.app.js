/**
 * @typedef {{rows: LAWSRow[]}} LAWSGrid
 *
 * @typedef {LAWSSlot[]} LAWSRow
 *
 * @typedef LAWSSlot
 * @property {'EMPTY' | 'SLOT' | 'DRAW_PILE' | 'WASTE_PILE'} slotType
 * @property {LAWSModifier[]=} modifiers
 * @property {object[]=} content
 *
 * @typedef {{kind: string, quantity?: number}} LAWSModifier
 */

export const gridConstants = {
  CONTAINER: "container",
  EMPTY: "empty",
  SLOT: "slot",
  FOUNDATION: "foundation",
  ROW: "row",
  DRAW_PILE: "drawPile",
  WASTE_PILE: "wastePile",
  LIMIT: "limited",
  NO_LIMIT: "noLimit",
  HORIZONTAL: "horizontal",
  TILT_LEFT: "tiltLeft",
  TILT_RIGHT: "tiltRight",
  FACE_DOWN: "faceDown",
  FACE_UP: "faceUp",
};

/** @param {string} className */
const lgc = (className) => `lawsGrid-${className}`;

/** @param {LAWSGrid} gridLayout */
const gridContainer = (gridLayout) => {
  const gridRows = gridLayout.rows.map((slots) => gridRow(slots)).join("\n");
  return `<section class="${lgc(gridConstants.CONTAINER)}">${gridRows}</section>`;
};

/** @param {LAWSSlot[]} slots */
const gridRow = (slots) => {
  const rowSlots = slots.map((slot) => gridSlot(slot)).join("\n");
  return `<div class="${lgc(gridConstants.ROW)}">${rowSlots}</div>`;
};

/** @param {LAWSSlot} slot */
const gridSlot = (slot) => {
  let modClasses = slot.modifiers ? " " + slot.modifiers.map((mod) => lgc(mod.kind)).join(" ") : "";
  if (slot.slotType === gridConstants.EMPTY) modClasses += ` ${lgc(gridConstants.EMPTY)}`;

  let dataAttrs = "";
  const limit = slot.modifiers?.find((mod) => mod.kind === gridConstants.LIMIT);
  if (limit) {
    dataAttrs += ` data-${gridConstants.LIMIT}="${limit.quantity}"`;
  }

  return `<div class="${lgc(gridConstants.SLOT)}${modClasses}"${dataAttrs}>&nbsp;</div>`;
};

const gridComponents = {
  gridContainer,
  gridRow,
  gridSlot,
};

/** @param {LAWSGrid} layoutObject */
const isValidLayout = (layoutObject) => {
  if (!layoutObject || typeof layoutObject !== "object" || !layoutObject.rows || !Array.isArray(layoutObject.rows))
    return false;

  layoutObject.rows.forEach((row) => {
    if (row.length === 0) return false;

    const slot = row[0];
    if (typeof slot !== "object" || !slot.slotType) return false;
  });

  return true;
};

/** @param {LAWSGrid} layoutObject */
const makeGrid = (layoutObject) => {
  if (!isValidLayout(layoutObject)) return "";
  return gridComponents.gridContainer(layoutObject);
};

export { isValidLayout, makeGrid };
