# 优化 Effect 代码

> 1. cleanupEffect 函数抽离
> 2. 频繁调用 stop 没有必要 性能优化
> 3. onStop 功能 在调用 stop 的时候触发一个回调函数 在 effect 的 第二个参数中

```ts
it("events: onStop", () => {
  const onStop = jest.fn();
  const runner = effect(() => {}, {
    onStop,
  });

  stop(runner);
  expect(onStop).toHaveBeenCalled();
});
```

```ts
import { extend } from "@relaxed/shared";  // Object.assign

let activeEffect;
export class ReactiveEffect {
  deps = [];
  activeStop = true;
  // 可有可无
  onStop?: () => void;
  constructor(public fn, public scheduler?) {}
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
  if (!activeEffect) return;
  // 一开始没有 activeEffect
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
