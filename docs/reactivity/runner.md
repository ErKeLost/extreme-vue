# runner

## 完善 effect 功能

```ts
it("show return runner when call effect", () => {
  let foo = 10;
  const runner = effect(() => {
    foo++;
    return "foo";
  });
  expect(foo).toBe(11);
  const r = runner();
  expect(foo).toBe(12);
  expect(r).toBe("foo");
});
```

调用 effect 之后返回一个函数 然后调用返回的函数 他会执行我们 effect 中的 fn 并且我们可以获取到返回值

```ts
class ReactiveEffect {
  private _fn: any;
  constructor(fn) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    // this._fn();
    // 调用这个函数会有返回值
    return this._fn();
  }
}

export function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
  // 第一步调用函数先有返回值  // this 必须显示绑定成effect 实例
  return _effect.run.bind(_effect);
}
```
