import { ReactiveEffect } from "./effect";

class ComputedImpl {
  private _getter: () => any;
  private _dirty = true;
  private _value: () => any;
  private _effect: ReactiveEffect;
  constructor(getter) {
    this._getter = getter;
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
      }
    });
  }
  get value() {
    // 当响应式依赖的值发生改变的时候 我们就需要让dirty 等于true 再去调用

    if (this._dirty) {
      this._dirty = false;
      this._value = this._effect.run();
    }
    return this._value;
  }
}

export function computed(fn) {
  return new ComputedImpl(fn);
}
