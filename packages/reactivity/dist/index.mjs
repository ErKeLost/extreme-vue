// src/effect.ts
var activeEffect;
var ReactiveEffect = class {
  constructor(fn) {
    this.fn = fn;
  }
  run() {
    activeEffect = this;
    this.fn();
  }
};
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
  console.log(activeEffect);
  dep.add(activeEffect);
  console.log(dep);
}
function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  for (const effect2 of dep) {
    console.log(effect2);
    effect2.run();
  }
}
function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}

// src/reactive.ts
function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key);
      track(target, key);
      console.log("\u89E6\u53D1get");
      return res;
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value);
      trigger(target, key);
      console.log("\u89E6\u53D1set");
      return res;
    }
  });
}
export {
  effect,
  reactive
};
//# sourceMappingURL=index.mjs.map