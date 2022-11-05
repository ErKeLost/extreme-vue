# 实现 proxyRefs 功能

## 代理一个 ref 不需要返回 .value

```ts
it("proxyRefs", () => {
  const user = {
    age: ref(10),
    name: "xiaohong",
  };
  const proxyUser = proxyRefs(user);
  expect(user.age.value).toBe(10);
  expect(proxyUser.age).toBe(10);
  expect(proxyUser.name).toBe("xiaohong");

  (proxyUser as any).age = 20;
  expect(proxyUser.age).toBe(20);
  expect(user.age.value).toBe(20);

  proxyUser.age = ref(10);
  expect(proxyUser.age).toBe(10);
  expect(user.age.value).toBe(10);
});
```

```ts
export function isRef(ref) {
  return !!ref.__v_isRef;
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(ref) {
  // 判断调用了 get 或者 set/
  return new Proxy(ref, {
    get(target, key) {
      return unRef(Reflect.get(target, key));
    },
    // 判断set的时候 是不是一个 ref 是 ref 就调用 .value
    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value);
      }
    },
  });
}
```
