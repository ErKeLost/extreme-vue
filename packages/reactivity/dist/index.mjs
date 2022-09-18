// src/effect.ts
import { extend } from "@relaxed/shared";
var activeEffect;
var ReactiveEffect = class {
  constructor(fn, scheduler) {
    this.fn = fn;
    this.scheduler = scheduler;
  }
  deps = [];
  activeStop = true;
  onStop;
  run() {
    activeEffect = this;
    return this.fn();
  }
  stop() {
    if (this.activeStop) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.activeStop = false;
    }
  }
};
function cleanupEffect(effect2) {
  effect2.deps.forEach((dep) => {
    dep.delete(effect2);
  });
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
  if (!activeEffect)
    return;
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}
function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  for (const effect2 of dep) {
    if (effect2.scheduler) {
      effect2.scheduler();
    } else {
      effect2.run();
    }
  }
}
function effect(fn, options = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  extend(_effect, options);
  console.log(_effect);
  _effect.run();
  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

// src/baseHandlers.ts
var get = createGetter();
var set = createSetter();
var readonlyGet = createGetter(true);
function createGetter(isReadonly = false) {
  return function get2(target, key) {
    const res = Reflect.get(target, key);
    if (!isReadonly) {
      track(target, key);
    }
    return res;
  };
}
function createSetter() {
  return function set2(target, key, value) {
    const res = Reflect.set(target, key, value);
    trigger(target, key);
    return res;
  };
}
var mutableHandlers = {
  get,
  set
};
var readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`${key} is not change ${target} is read-only`);
    return true;
  }
};

// src/reactive.ts
function reactive(raw) {
  return createActiveObject(raw, mutableHandlers);
}
function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers);
}
function createActiveObject(raw, Handlers) {
  return new Proxy(raw, Handlers);
}
export {
  effect,
  reactive,
  readonly
};
//# sourceMappingURL=index.mjs.map