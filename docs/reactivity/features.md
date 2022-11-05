# Effect 的 scheduler 功能

> 1. 调用 effect 传入一个 fn 可以传第二个参数 options， scheduler 接收一个函数
> 2. 一开始第一次不会被调用，会执行 effect 第一个 fn，
> 3. 当响应式对象值发生改变，scheduler 方法 会被执行， 不会再去调用第一个 fn
> 4. 调用 scheduler 方法 把 run 得到 runner 函数 调用 runner 函数所以 run 执行 runner 函数 dummy 值会发生改变

```ts
it("scheduler", () => {
  let dummy;
  let run: any;
  const scheduler = jest.fn(() => {
    run = runner;
  });
  const obj = reactive({ foo: 1 });
  const runner = effect(
    () => {
      dummy = obj.foo;
    },
    { scheduler }
  );
  expect(scheduler).not.toHaveBeenCalled();
  expect(dummy).toBe(1);
  // should be called on first trigger
  obj.foo++;
  expect(scheduler).toHaveBeenCalledTimes(1);
  // // should not run yet
  expect(dummy).toBe(1);
  // // manually run
  run();
  // // should have run
  expect(dummy).toBe(2);
});
```

## 代码实现

```ts
let activeEffect;
export class ReactiveEffect {
  constructor(public fn, public scheduler?) {}
  run() {
    activeEffect = this;
    return this.fn();
  }
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
  // console.log(activeEffect);
  dep.add(activeEffect);
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
  const scheduler = options.scheduler;
  const _effect = new ReactiveEffect(fn, scheduler);
  _effect.run();
  return _effect.run.bind(_effect);
}
```
