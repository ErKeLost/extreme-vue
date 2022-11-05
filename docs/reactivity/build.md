# 实现 isReactive 和 isReadonly

> 判断当前是一个 reactive 或者 是一个 readonly
> 如何判断 只要 触发了 proxy 的 get 操作

```ts
export const enum ReactiveFlags {
  IS_REACTIVE = "_v_isReactive",
  IS_READONLY = "_v_isReadonly",
}

export function isReactive(raw) {
  // 如果是原始对象没有 proxy 代理 是undefined 转成 boolean
  return !!raw[ReactiveFlags.IS_REACTIVE];
}
export function isReadonly(raw) {
  return !!raw[ReactiveFlags.IS_READONLY];
}

export function createGetter(isReadonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key);
    // track
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }
    if (!isReadonly) {
      track(target, key);
    }
    // console.log("触发get");
    return res;
  };
}
```
