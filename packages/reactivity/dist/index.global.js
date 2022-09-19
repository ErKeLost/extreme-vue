"use strict";
(() => {
  // ../shared/src/index.ts
  var isObject = (val) => {
    return val !== null && typeof val === "object";
  };
  var extend = Object.assign;
  function hasChanged(value, oldValue) {
    return !Object.is(value, oldValue);
  }

  // src/effect.ts
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
    extend(_effect, options);
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
      if (isObject(res)) {
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
  var shadowReadonlyHandlers = extend({}, readonlyHandlers, {
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
  var RefImpl = class {
    _value;
    _rawValue;
    __v_isRef = true;
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
      if (hasChanged(newValue, this._rawValue)) {
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
    return isObject(value) ? reactive(value) : value;
  }
})();
//# sourceMappingURL=index.global.js.map