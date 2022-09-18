"use strict";
(() => {
  // ../shared/src/index.ts
  var extend = Object.assign;

  // src/effect.ts
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
})();
//# sourceMappingURL=index.global.js.map