# 实现 shadowReadonly

:::warning Experimental
shallow就是表层的意思,如果是响应式对象，那么它只能是最外层的一层对象是响应式对象，我们把shallow和readonly结合起来就是 创建出来的一个响应式对象 最外层是一个 readonly 其他里面的层次对象不是
:::

```ts
const shallowReadonlyGet = createGetter(true, true)

export function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key)
    // track
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    if (shallow) {
      return res
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
}

export function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value)
    // trigger
    trigger(target, key)
    // console.log("触发set");
    return res
  }
}

export const mutableHandlers = {
  get,
  set,
}
export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`${key} is not change ${target} is read-only`)
    return true
  },
}
export const shadowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
})
```
