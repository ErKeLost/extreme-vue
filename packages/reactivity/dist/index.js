"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  effect: () => effect,
  reactive: () => reactive,
  readonly: () => readonly
});
module.exports = __toCommonJS(src_exports);

// src/effect.ts
var import_shared = require("@relaxed/shared");
var activeEffect;
var shouldTrack;
var ReactiveEffect = class {
  constructor(fn, scheduler) {
    this.fn = fn;
    this.scheduler = scheduler;
  }
  deps = [];
  activeStop = true;
  onStop;
  run() {
    if (!this.activeStop) {
      return this.fn();
    }
    shouldTrack = true;
    activeEffect = this;
    const res = this.fn();
    shouldTrack = false;
    return res;
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
  effect2.deps.length = 0;
}
var targetMap = /* @__PURE__ */ new Map();
function track(target, key) {
  if (!activeEffect)
    return;
  if (!shouldTrack)
    return;
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
  (0, import_shared.extend)(_effect, options);
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
    if (key === "_v_isReactive" /* IS_REACTIVE */) {
      return !isReadonly;
    } else if (key === "_v_isReadonly" /* IS_READONLY */) {
      return isReadonly;
    }
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  effect,
  reactive,
  readonly
});
//# sourceMappingURL=index.js.map