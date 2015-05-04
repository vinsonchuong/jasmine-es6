export default class Privates {
  constructor() {
    this.weakMap = new WeakMap();
  }

  get(key) {
    return this.weakMap.get(key);
  }

  set(key, value) {
    this.weakMap.set(key, value);
    return this;
  }

  has(key) {
    return this.weakMap.has(key);
  }

  delete(key) {
    return this.weakMap.delete(key);
  }

  assign(instance, obj) {
    return this.set(instance, Object.assign(this.get(instance), obj));
  }
}
