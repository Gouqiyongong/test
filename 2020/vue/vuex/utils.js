export function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key));
}

export function isPromis (obj) {
  return obj && typeof obj.then === 'function';
}