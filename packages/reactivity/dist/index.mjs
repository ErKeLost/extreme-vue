// src/effect.ts
var activeEffect;
var ReactiveEffect = class {
  _fn;
  constructor(fn) {
    this._fn = fn;
  }
  run() {
    this._fn();
    activeEffect = this;
  }
};
function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}
var targetMap = /* @__PURE__ */ new Map();
function track(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = /* @__PURE__ */ new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = /* @__PURE__ */ new Set();
    depsMap.set(key, dep);
  }
  dep.add(activeEffect);
}
function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  for (const effect2 of dep) {
    effect2._fn();
  }
}

// src/reactive.ts
function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key);
      track(target, key);
      return res;
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value);
      trigger(target, key);
      return res;
    }
  });
}
export {
  effect,
  reactive
};
//# sourceMappingURL=index.mjs.map