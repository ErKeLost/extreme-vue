# Reactive

## Reactive

reactive 其实就是一个函数， 然后通过传递一个函数，我们返回一个 proxy, 在 get 和 set 的时候进行触发和收集依赖的过程

```ts
// 接收一个对象
export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key);
      // TODO 收集依赖
      return res;
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value);
      // TODO 触发依赖
      return res;
    },
  });
}
```

## Effect

