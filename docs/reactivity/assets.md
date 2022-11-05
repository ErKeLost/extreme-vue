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

## 优化 reactive 模块代码

```ts
import { mutableHandlers, readonlyHandlers } from "./baseHandlers";
// true  false 判断是否是 readonly
export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers);
}

function createActiveObject(raw, Handlers) {
  return new Proxy(raw, Handlers);
}
```

## 抽离 handler 模块

```ts
import { track, trigger } from "./effect";

// 缓存一个getter & setter
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
// 高阶函数判断逻辑
export function createGetter(isReadonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key);
    // track
    if (!isReadonly) {
      track(target, key);
    }
    // console.log("触发get");
    return res;
  };
}

export function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);
    // trigger
    trigger(target, key);
    // console.log("触发set");
    return res;
  };
}

export const mutableHandlers = {
  get,
  set,
};
export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`${key} is not change ${target} is read-only`);
    return true;
  },
};
```
