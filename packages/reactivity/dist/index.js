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
  readonly: () => readonly,
  ref: () => ref
});
module.exports = __toCommonJS(src_exports);

// src/baseHandlers.ts
var import_shared2 = require("@relaxed/shared");

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
  if (!isTracking()) {
    return;
  }
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
  trackEffect(dep);
}
function trackEffect(dep) {
  if (dep.has(activeEffect))
    return;
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}
function triggerEffect(dep) {
  for (const effect2 of dep) {
    if (effect2.scheduler) {
      effect2.scheduler();
    } else {
      effect2.run();
    }
  }
}
function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  triggerEffect(dep);
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
function isTracking() {
  return shouldTrack && activeEffect !== void 0;
}

// src/baseHandlers.ts
var get = createGetter();
var set = createSetter();
var readonlyGet = createGetter(true);
var shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly = false, shallow = false) {
  return function get2(target, key) {
    const res = Reflect.get(target, key);
    if (key === "_v_isReactive" /* IS_REACTIVE */) {
      return !isReadonly;
    } else if (key === "_v_isReadonly" /* IS_READONLY */) {
      return isReadonly;
    }
    if (shallow) {
      return res;
    }
    if ((0, import_shared2.isObject)(res)) {
      return isReadonly ? readonly(res) : reactive(res);
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
var shadowReadonlyHandlers = (0, import_shared2.extend)({}, readonlyHandlers, {
  get: shallowReadonlyGet
});

// src/reactive.ts
function reactive(raw) {
  return createReactiveObject(raw, mutableHandlers);
}
function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers);
}
function createReactiveObject(raw, Handlers) {
  return new Proxy(raw, Handlers);
}

// src/ref.ts
var import_shared3 = require("@relaxed/shared");
var RefImpl = class {
  _value;
  _rawValue;
  dep;
  constructor(value) {
    this._rawValue = value;
    this._value = convert(value);
    this.dep = /* @__PURE__ */ new Set();
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newValue) {
    if ((0, import_shared3.hasChanged)(newValue, this._rawValue)) {
      this._rawValue = newValue;
      this._value = convert(newValue);
      triggerEffect(this.dep);
    }
  }
};
function ref(value) {
  return new RefImpl(value);
}
function trackRefValue(ref2) {
  if (isTracking()) {
    trackEffect(ref2.dep);
  }
}
function convert(value) {
  return (0, import_shared3.isObject)(value) ? reactive(value) : value;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  effect,
  reactive,
  readonly,
  ref
});
//# sourceMappingURL=index.js.map