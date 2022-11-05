# Is Proxy

:::tip Note
Is Proxy 是用来检测一个对象是不是被 reactive 或者 readonly 创建出来的

```ts
export function isProxy(raw) {
  return isReactive(raw) || isReadonly(raw)
}
```
