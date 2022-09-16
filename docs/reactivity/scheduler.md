# scheduler

## 调度

```ts
test("scheduler", () => {
  // 通过effect的第二个参数 给定一个 scheduler 的fn 当effect 第一次执行的时候还会执行fn
  // effect 第一次执行的之后 会默认执行 fn
  // 当响应式对象set 之后 不会执行fn 而是会执行scheduler
  // 如果我们当时在执行runner的时候 会再次执行effect的第一个参数
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
    {
      scheduler,
    }
  );
  expect(scheduler).not.toHaveBeenCalled();
  expect(dummy).toBe(1);
  // should be called on 第一次trigger
  obj.foo++; // 如果我们set之后 如果有scheduler 他回去执行scheduler 而不会去调用第一个 effect 参数
  expect(scheduler).toHaveBeenCalledTimes(1);
  // 不会再去执行run
  expect(dummy).toBe(1);
  run();
  expect(dummy).toBe(2);
});
```

## code

```ts
export function effect(fn, options: any = {}) {
  const scheduler = options.scheduler
  const _effect = new ReactiveEffect(fn, scheduler);
  _effect.run();
  const runner = _effect.run,bind(_effect)
  return runner
}
```

```ts
export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  for (const effect of dep) {
    if (effect.scheduler) {
        effect.scheduler()
    } else [
        effect.run();
    ]
  }
}
```

```ts
class ReactiveEffect {
  private _fn: any;
  constructor(fn, public scheduler?) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    this._fn();
  }
}
```
