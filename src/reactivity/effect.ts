import { extend } from "../shared";
let activeEffect;
let shouldTrack;
export class ReactiveEffect {
  private _fn;
  deps = [];
  onStop?: () => void;
  active = true;
  constructor(fn, public scheduler?) {
    this._fn = fn;
    this.scheduler = scheduler;
  }
  run() {
    // 这个时候收集依赖 但是因为 在 ++操作 会调用 get操作 还是会 收集依赖 所以我i们需要一个变量来判断
    if (!this.active) {
      return this._fn();
    }

    shouldTrack = true;
    activeEffect = this;
    const result = this._fn();
    // 重置
    shouldTrack = false;
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
}
const targetMap = new Map();
function cleanupEffect(currentEffect) {
  currentEffect.deps.forEach((activeEffect) => {
    activeEffect.delete(currentEffect);
  });
  // 优化点  已经 清空完了 deps 的存在就没有意义了
  currentEffect.deps.length = 0;
}
export function track(target, key) {
  // 2021.12.23 问题所在 stop  ++ 操作同时调用set get  24号再看
  // if (!activeEffect) return;
  // if (!shouldTrack) return;
  if (!isTacking()) return;
  let depMap = targetMap.get(target);
  if (!depMap) {
    depMap = new Map();
    targetMap.set(target, depMap);
  }
  let dep = depMap.get(key);
  if (!dep) {
    dep = new Set();
    depMap.set(key, dep);
  }

  trackEffects(dep);
}
export function isTacking() {
  return shouldTrack && activeEffect !== undefined;
}
export function trackEffects(dep) {
  // 判断是否添加过 添加过 就不在添加了
  // if (!dep.has(activeEffect)) return;
  if (dep.has(activeEffect)) return;
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}
export function triggerEffects(dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
export function trigger(target, key) {
  let depMap = targetMap.get(target);
  let dep = depMap.get(key);
  triggerEffects(dep);
}
export function stop(runner) {
  return runner._effect.stop();
}
export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);

  // _effect.onStop = options.onStop;  方式不优雅  优雅写法在下
  // Object.assign(_effect, options); // 还是不具有语义化
  extend(_effect, options);
  _effect.run();
  const runner = _effect.run.bind(_effect);
  runner._effect = _effect;
  return runner;
}
