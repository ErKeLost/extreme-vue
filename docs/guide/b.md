# 实现 computed 计算属性

> computed 和 ref 类型 都是返回一个 .value 但是 computed 有一个功能就是缓存机制

```ts
describe('computed', () => {
  it('happy path', () => {
    const value = reactive({
      foo: 1
    })

    const getter = computed(() => {
      return value.foo
    })

    expect(getter.value).toBe(1)
  })

  it('should compute lazily', () => {
    const value = reactive({
      foo: 1
    })
    const getter = jest.fn(() => {
      console.log(666)
      return value.foo
    })
    const cValue = computed(getter)

    // lazy
    expect(getter).not.toHaveBeenCalled()

    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)

    // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    // should not compute until needed
    value.foo = 2
    expect(getter).toHaveBeenCalledTimes(1)

    // now it should compute
    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)

    // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(2)
  })
})
```

```ts
// import { createDep } from "./dep";
import { ReactiveEffect } from './effect'
// import { trackRefValue, triggerRefValue } from "./ref";

class ComputedRefImpl {
  private _getter
  private _dirty: boolean = true
  private _value: any
  private _effect: ReactiveEffect
  constructor(getter) {
    this._getter = getter

    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
      }
    })
  }
  get value() {
    // 调用一次之后 做一个缓存机制
    // 等依赖的数据发生响应式之后 我们再次执行 getter 把dirty变成true
    if (this._dirty) {
      this._dirty = false
      this._value = this._effect.run()
      // this._value = this._getter()
      // return this._getter()
    }
    return this._value
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter)
}
```
