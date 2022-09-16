# Reactive

## Reactive

```ts
it("reactive", () => {
  const user = reactive({ age: 10 });
  let nextage;
  effect(() => {
    nextage = user.age + 1;
  });
  expect(nextage).toBe(11);
  // update
  user.age += 1;
  expect(nextage).toBe(12);
});
```

:::tip
reactive 其实就是一个函数， 然后通过传递一个函数，我们返回一个 proxy, 在 get 和 set 的时候进行触发和收集依赖的过程
:::

```ts
// 接收一个对象
export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key);
      // TODO 收集依赖
      track(target, key);
      return res;
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value);
      // TODO 触发依赖
      trigger(target, key);
      return res;
    },
  });
}
```

## Effect

:::tip
我们需要一个 effect 函数来去监听操作发生了改变 接受一个函数作为参数, 目标就是把每次传进来的这个函数保存起来, 等后续我们再去调用响应式对象的 set 操作的时候再去调用函数
:::

```ts
// 抽离一个类进行封装 class 只是为了更好的封装性 与 抽离

class ReactiveEffect {
  private _fn: any;
  constructor(fn) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    this._fn();
  }
}

export function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}
```

## Track

:::tip
如何收集依赖， track 做的事 就是我们每一个响应式对象的每一个属性都对应着一个 effect 函数
对应关系就是 target -> key -> effect
:::

```ts
let activeEffect;
const targetMap = new Map();
export function track(target, key) {
  // 根据对应关系我们需要有一个容器保存这个target对象 我们只能使用map
  let depsMap = targetMap.get(target);
  // 因为一开始我们获取 depsMap的时候 target 是没有对应的 map依赖
  // 我们需要先提前创建好
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  // 获取所有的 key Map dep也是一样的 一开始没有需要创建
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  dep.add(activeEffect);
  // 然后我们需要把 effect 触发的fn 函数存到 dep 里面 我们可以创建一个全局变量
  // 第一次我们肯定会调用 effect函数 我们可以在run方法中 给全局变量赋值

  // effect我们使用set存储 因为不能重复收集
  const effectDep = new Set();
}
```

## Trigger

:::tip
因为我们在使用的时候已经触发了依赖了 我们已经把 effect 中的 fn 存到了当前
dep 中 我们只需要取出来 target 我们对应的 key 并且找到对应的 dep 并且调用遍历之前所有的 dep 中的函数 就实现了 trigger
:::

```ts
export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  for (const effect of dep) {
    effect.run();
  }
}
```
