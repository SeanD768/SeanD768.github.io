/**
 * A factory that creates focus observers.
 * A focus observer is a module that informs, via callbacks,
 * when the provided element gains or loses focus.
 *
 * @function createFocusObserver
 * @param  {HTMLElement} element
 * @param  {Function} [focusOutCallback=() => {}]
 * @param  {Function} [focusInCallback=() => {}]
 * @returns {Object}
 */
export default function createFocusObserver(
  element,
  focusOutCallback = () => {},
  focusInCallback = () => {}
) {
  let isActive = false;

  function onFocusOut(event) {
    const target = event.target;

    if (element.contains(target) || element === target) {
      focusInCallback();

      return;
    }

    focusOutCallback();
  }

  return {
    activate() {
      if (isActive) {
        return;
      }

      document.body.addEventListener('focus', onFocusOut, true);
      document.body.addEventListener('click', onFocusOut, false);
      isActive = true;
    },
    deactivate() {
      if (!isActive) {
        return;
      }

      document.body.removeEventListener('focus', onFocusOut, true);
      document.body.removeEventListener('click', onFocusOut, false);
      isActive = false;
    },
  };
};
