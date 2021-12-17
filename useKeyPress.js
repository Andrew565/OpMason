/**
 * @param {string} targetKey
 * @param {EventListener} downHandler
 * @param {EventListener} upHandler
 */
export const useKeyPress = (targetKey, downHandler, upHandler) => {
  /** @param {KeyboardEvent} evt */
  const downChecker = (evt) => {
    if (evt.key === targetKey) downHandler(evt);
  };

  /** @param {KeyboardEvent} evt */
  const upChecker = (evt) => {
    if (evt.key === targetKey) upHandler(evt);
  };

  window.addEventListener("keydown", downChecker);
  window.addEventListener("keyup", upChecker);

  return () => {
    window.removeEventListener("keydown", downChecker);
    window.removeEventListener("keyup", upChecker);
  };
};
