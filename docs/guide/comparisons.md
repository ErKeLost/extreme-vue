# Ref

## ref 解析

> 因为响应式需要代理对象， ref 作为基于 reactive 的响应式对象， 支持基本类型，但是 proxy 需要代理的是对象，所以我们需要把 ref 变成一个对象这样才能变成响应式
> ref 函数返回一个类 我们需要这个类去变成一个对象， 我们可以使用 类的 get， set 操作

```ts
export function ref(value) {
  return new RefImpl(value);
}

class RefImpl {
  private _value: any;
  private _rawValue: any;
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

export function trackEffect(dep) {
  if (dep.has(activeEffect)) return;
  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

export function triggerEffect(dep) {
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
```
