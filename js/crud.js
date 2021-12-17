const addableThings = {
  slot: `Slot`,
  row: `<div class="slot">
          <button class="addButton" data-add-type="slot">+ Slot</button>
        </div>`,
};

/** @type {EventListener} */
function addThing(e) {
  const target = /** @type {HTMLButtonElement} */ (e.target);

  const thingToAdd = target.dataset.addType;
  const newThing = addableThings[thingToAdd];
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
