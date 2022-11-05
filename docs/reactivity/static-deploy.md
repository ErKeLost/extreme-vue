# stop 优化


> 如果 在触发响应式操作的时候 调用了 ++ 操作 类似 
> ```ts
> obj.num++
> obj.num = obj.num + 1
> ```
> 会同时触发 get 和 set 操作 他还是会把 依赖存进去 导致没有 删除dep stop失效
```ts
import { extend } from "@relaxed/shared";

let activeEffect;
let shouldTrack;
export class ReactiveEffect {
  deps = [];
  activeStop = true;
  // 可有可无
  onStop?: () => void;
  constructor(public fn, public scheduler?) {}
  run() {
    // 1. 会收集依赖
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
}
function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
}
const targetMap = new Map();
export function track(target, key) {
  // target -> key -> dep
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  // 一开始没有 activeEffect
  if (!activeEffect) return;
  // 防止 同时触发 get 和 set 操作 他还是会收集到依赖 stop 会失效
  if (!shouldTrack) return;
  // console.log(activeEffect);
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

export function trigger(target, key) {
  // 取出所有 收集到的依赖 进行遍历
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  extend(_effect, options);
  console.log(_effect);
  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}
```
