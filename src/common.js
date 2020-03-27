export function assert(exp, msg) {
  if (!exp) {
    throw new Error(msg || 'assert fiald')
  }
}

export function getElement(dom) {
  assert(dom)
  let vm;
  if (typeof dom == 'string') {
    vm = document.querySelector(dom)
    assert(vm, `element "${vm}" is not found`);
  } else if (dom instanceof HTMLElement) {
    vm = dom
  }
  return vm
}