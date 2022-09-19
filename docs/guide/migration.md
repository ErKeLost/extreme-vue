# 实现 isRef 和 unRef 功能

## isRef

> test

```ts
it("isRef", () => {
  const a = ref(1);
  const user = reactive({
    age: 1,
  });
  expect(isRef(a)).toBe(true);
  expect(isRef(1)).toBe(false);
  expect(isRef(user)).toBe(false);
});

it("unRef", () => {
  const a = ref(1);
  expect(unRef(a)).toBe(1);
  expect(unRef(1)).toBe(1);
});
```

> 通过给 ref 实例添加一个属性判断是否是 ref ` public __v_isRef = true;` unRef 就是 isRef 的语法糖

```ts
class RefImpl {
  private _value: any;
  private _rawValue: any;
  // 判断是否是一个ref
  public __v_isRef = true;
  // 创建一个dep 收集依赖
  public dep;
  constructor(value) {
    // 存储 原始普通对象的value值 用于对比
    this._rawValue = value;
    this._value = convert(value);
    // 判断value 是不是对象 是对象就装换成reactive

    this.dep = new Set();
  }
  get value() {
    trackRefValue(this);
    // ref 只监听一个 value 的变化 value的依赖收集
    return this._value;
  }
  set value(newValue) {
    // 如果value 是一个 对象 就会被转换成reactive 新的值 是 proxy 对比 要转换成普通对象
    // if (hasChanged(newValue, this._value)) {
    if (hasChanged(newValue, this._rawValue)) {
      // if (Object.is(newValue, this._value)) return
      // 必须要先修改value的值 再去通知
      this._rawValue = newValue;
      this._value = convert(newValue);
      triggerEffect(this.dep);
    }
  }
}

export function ref(value) {
  return new RefImpl(value);
}

export function isRef(ref) {
  return !!ref.__v_isRef;
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}
```
