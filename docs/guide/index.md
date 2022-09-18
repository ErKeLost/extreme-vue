# Effect 返回 runner

> 调用 effect 之后 返回一个函数 调用这个函数，他会再次执行传给 effect 内部的 fn，并且拿到内部 fn 的返回值

```ts
let res = 666;
const runner = effect(() => {
  res++;
  return 99999;
});
console.log(res); // 667
const w = runner();
console.log(w); // 99999
console.log(res); // 668
```

```ts
let activeEffect;
export class ReactiveEffect {
  constructor(public fn) {}
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
  console.log(targetMap);
}

export function trigger(target, key) {
  // 取出所有 收集到的依赖 进行遍历
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  for (const effect of dep) {
    effect.run();
  }
}

export function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
  return _effect.run.bind(_effect);
}
```
