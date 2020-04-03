export function assert(exp, msg) {
  if (!exp) {
    throw new Error(msg || 'assert error');
  }
}

export function dom(arg) {
  assert(arg);

  if (typeof arg == 'string') {
    let res = document.querySelector(arg);

    assert(res);

    return res;
  } else if (arg instanceof Node) {
    return arg;
  } else {
    assert(false);
  }
}
