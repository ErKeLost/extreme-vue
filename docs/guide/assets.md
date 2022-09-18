# Readonly 功能

> Readonly 不可能被 set 只读

```ts
export function readonly(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key);
      // track
      // console.log("触发get");
      return res;
    },
    set(target, key, value) {
      console.warn(`${target} is read-only`);

      return true;
    },
  });
}
```
