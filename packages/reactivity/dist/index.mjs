// src/dep.ts
function createDep(effects) {
  const dep = new Set(effects);
  return dep;
}

// src/effect.ts
import { extend } from "@relaxed/shared";
var activeEffect = void 0;
var shouldTrack = false;
var targetMap = /* @__PURE__ */ new WeakMap();
var ReactiveEffect = class {
  constructor(fn, scheduler) {
    this.fn = fn;
    this.scheduler = scheduler;
    console.log("\u521B\u5EFA ReactiveEffect \u5BF9\u8C61");
  }
  active = true;
  deps = [];
  onStop;
  run() {
    console.log("run");
    if (!this.active) {
      return this.fn();
    }
    shouldTrack = true;
    activeEffect = this;
    console.log("\u6267\u884C\u7528\u6237\u4F20\u5165\u7684 fn");
    const result = this.fn();
    shouldTrack = false;
    activeEffect = void 0;
    return result;
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
};
function cleanupEffect(effect2) {
  effect2.deps.forEach((dep) => {
    dep.delete(effect2);
  });
  effect2.deps.length = 0;
}
function effect(fn, options = {}) {
  const _effect = new ReactiveEffect(fn);
  extend(_effect, options);
  _effect.run();
  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
function stop(runner) {
  runner.effect.stop();
}
function track(target, type, key) {
  if (!isTracking()) {
    return;
  }
  console.log(`\u89E6\u53D1 track -> target: ${target} type:${type} key:${key}`);
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = /* @__PURE__ */ new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = createDep();
    depsMap.set(key, dep);
  }
  trackEffects(dep);
}
function trackEffects(dep) {
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
function trigger(target, type, key) {
  let deps = [];
  const depsMap = targetMap.get(target);
  if (!depsMap)
    return;
  const dep = depsMap.get(key);
  deps.push(dep);
  const effects = [];
  deps.forEach((dep2) => {
    effects.push(...dep2);
  });
  triggerEffects(createDep(effects));
}
function isTracking() {
  return shouldTrack && activeEffect !== void 0;
}
function triggerEffects(dep) {
  for (const effect2 of dep) {
    if (effect2.scheduler) {
      effect2.scheduler();
    } else {
      effect2.run();
    }
  }
}

// src/baseHandlers.ts
import { isObject } from "@relaxed/shared";
var get = createGetter();
var set = createSetter();
var readonlyGet = createGetter(true);
var shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly2 = false, shallow = false) {
  return function get2(target, key, receiver) {
    const isExistInReactiveMap = () => key === "__v_raw" /* RAW */ && receiver === reactiveMap.get(target);
    const isExistInReadonlyMap = () => key === "__v_raw" /* RAW */ && receiver === readonlyMap.get(target);
    const isExistInShallowReadonlyMap = () => key === "__v_raw" /* RAW */ && receiver === shallowReadonlyMap.get(target);
    if (key === "__v_isReactive" /* IS_REACTIVE */) {
      return !isReadonly2;
    } else if (key === "__v_isReadonly" /* IS_READONLY */) {
      return isReadonly2;
    } else if (isExistInReactiveMap() || isExistInReadonlyMap() || isExistInShallowReadonlyMap()) {
      return target;
    }
    const res = Reflect.get(target, key, receiver);
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isObject(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  };
}
function createSetter() {
  return function set2(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver);
    trigger(target, "set", key);
    return result;
  };
}
var readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    );
    return true;
  }
};
var mutableHandlers = {
  get,
  set
};
var shallowReadonlyHandlers = {
  get: shallowReadonlyGet,
  set(target, key) {
    console.warn(
      `Set operation on key "${String(key)}" failed: target is readonly.`,
      target
    );
    return true;
  }
};

// src/reactive.ts
var reactiveMap = /* @__PURE__ */ new WeakMap();
var readonlyMap = /* @__PURE__ */ new WeakMap();
var shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function reactive(target) {
  return createReactiveObject(target, reactiveMap, mutableHandlers);
}
function readonly(target) {
  return createReactiveObject(target, readonlyMap, readonlyHandlers);
}
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    shallowReadonlyMap,
    shallowReadonlyHandlers
  );
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function isReadonly(value) {
  return !!value["__v_isReadonly" /* IS_READONLY */];
}
function isReactive(value) {
  return !!value["__v_isReactive" /* IS_REACTIVE */];
}
function createReactiveObject(target, proxyMap, baseHandlers) {
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const proxy = new Proxy(target, baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}

// src/ref.ts
import { isObject as isObject2, hasChanged } from "@relaxed/shared";
var RefImpl = class {
  _rawValue;
  _value;
  dep;
  __v_isRef = true;
  constructor(value) {
    this._rawValue = value;
    this._value = convert(value);
    this.dep = createDep();
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      this._value = convert(newValue);
      this._rawValue = newValue;
      triggerRefValue(this);
    }
  }
};
function ref(value) {
  return createRef(value);
}
function convert(value) {
  return isObject2(value) ? reactive(value) : value;
}
function createRef(value) {
  const refImpl = new RefImpl(value);
  return refImpl;
}
function triggerRefValue(ref2) {
  triggerEffects(ref2.dep);
}
function trackRefValue(ref2) {
  if (isTracking()) {
    trackEffects(ref2.dep);
  }
}
var shallowUnwrapHandlers = {
  get(target, key, receiver) {
    return unRef(Reflect.get(target, key, receiver));
  },
  set(target, key, value, receiver) {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      return target[key].value = value;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
function unRef(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
function isRef(value) {
  return !!value.__v_isRef;
}

// src/computed.ts
var ComputedRefImpl = class {
  dep;
  effect;
  _dirty;
  _value;
  constructor(getter) {
    this._dirty = true;
    this.dep = createDep();
    this.effect = new ReactiveEffect(getter, () => {
      if (this._dirty)
        return;
      this._dirty = true;
      triggerRefValue(this);
    });
  }
  get value() {
    trackRefValue(this);
    if (this._dirty) {
      this._dirty = false;
      this._value = this.effect.run();
    }
    return this._value;
  }
};
function computed(getter) {
  return new ComputedRefImpl(getter);
}
export {
  ReactiveEffect,
  computed,
  effect,
  isProxy,
  isReactive,
  isReadonly,
  isRef,
  proxyRefs,
  reactive,
  readonly,
  ref,
  shallowReadonly,
  stop,
  unRef
};
//# sourceMappingURL=index.mjs.map