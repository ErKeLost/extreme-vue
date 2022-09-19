# 实现 reactive 和 readonly 嵌套对象转换功能

## 嵌套对象逻辑

如果 一个 对象中嵌套了 另一个对象，那麽如何做到对象嵌套类型为响应式

```ts
const original = {
  nested: {
    foo: 1,
  },
  array: [{ bar: 2 }],
}
const observed = reactive(original)
expect(isReactive(observed.nested)).toBe(true)
expect(isReactive(observed.array)).toBe(true)
expect(isReactive(observed.array[0])).toBe(true)
```

:::tip
我们需要在 get 的时候 判断 proxy 代理的对象返回的 res 是不是一个对象，如果他是对象类型，就代表我们需要把 res 转换成响应式对象
:::

```ts
function get(target, key) {
  const res = Reflect.get(target, key)
  // track
  if (key === ReactiveFlags.IS_REACTIVE) {
    return !isReadonly
  } else if (key === ReactiveFlags.IS_READONLY) {
    return isReadonly
  }
  // 嵌套reactive 如果 res 返回的是一个 object 那么我们就再次调用
  // 转换为reactive
  if (isObject(res)) {
    return isReadonly ? readonly(res) : reactive(res)
  }
  if (!isReadonly) {
    track(target, key)
  }
  // console.log("触发get");
  return res
}
```
