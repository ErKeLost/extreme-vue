# 实现 effect & reactive & 依赖收集 & 触发依赖

## reactive

> 实现响应式的核心 reactive 使用 reactive 创建一个响应式对象, 返回一个 proxy 对象，分别在我们调用属性或者给属性赋值的时候进行操作， 就是 get & set

```ts
export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key);
      // track
      track(target, key);
      // console.log("触发get");
      return res;
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value);
      // trigger
      trigger(target, key);
      // console.log("触发set");
      return res;
    },
  });
}

const counter = reactive({ num: 0 });
counter.num; // 触发 get 方法
counter.num = 9; // 触发 set 方法
```

> 然后需要通过调用 get 的时候我们去收集依赖， 等到 set 的时候 我们就去触发依赖
> get 调用 track 收集依赖
> set 调用 trigger 触发依赖

## effect

> effect 作为我们收集依赖的通道，返回一个函数，我们收集的依赖就是对应的当前调用属性的函数

举个例子

> effect 中接收一个函数 函数调用了 counter 对象的 get 方法， 所以我们需要收集这个依赖并且和调用对象的属性一一对应
> 比如

```ts
const counter = { num: 11 };
effect(() => counter.num);
```

:::tip
这种情况我们需要收集依赖的对应关系就是， 一个对象对应一个属性， 一个属性对应一个需要触发的 effect 副作用函数
counter -> num -> () => counter.num
:::

然后编写 effect 函数， 调用effect 立即执行 内部函数

```ts
let activeEffect;
class ReactiveEffect {
  constructor(public fn) {}
  run () {
    activeEffect = this
    this.fn()
  }
}
export function effect(fn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}
```

## track

> 收集依赖 依赖就是 effect 传入的 函数指的也就是 ReactiveEffect
> 依赖对应关系 counter -> num -> () => counter.num
> 接下来我们就只要把依赖存起来, 因为依赖不能重复 我们使用set 存放
> 放到哪里 每一个key 对应各自的依赖 每一个对象 对应多个 key 使用
> map保存

![reactive.jpg](/images/reactive.jpg)
```ts
// 创建 对象容器
const targetMap = new WeakMap()
export function track (target, key) {
  // target -> key -> dep
  // 初始化没有我们就创建一个
  // 收集所有key

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  // 获取 依赖
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  dep.add(activeEffect)
}

// 触发set的时候重新执行 effect 副作用函数 就能变成响应式了
export function trigger (target, key) {
  let depsMap = targetMap.get(target)
  let deps = depsMap.get(key)
  for(const effect of deps) {
    effect.run()
  }
}

```