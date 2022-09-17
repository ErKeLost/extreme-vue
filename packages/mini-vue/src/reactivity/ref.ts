import { hasChange, isObject } from ".@relaxed/shared";
import { isTacking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";
// ref 为了监听数据的收集依赖 和 触发依赖 所以 需要 我们可以使用类的访问器属性包装成一个对象 以.value的形式 作用于proxy
class RefImpl {
  private _value: any;
  public dep;
  private _rawValue: any;
  public _v_isRef = true;
  constructor(value) {
    // 新建一个对象存储还没有修改的value  对比的时候我们直接对比_rawValue
    this._rawValue = value;
    this._value = convert(value);
    // 如果我们ref 传进来的是一个对象的话 那么就是 包装成一个reactive返回的结果
    // 1.判断 value是不是一个对象

    this.dep = new Set();
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(value: any) {
    // 如果修改了相同的值 那么就不会再去触发依赖
    // 还有一个点 对比的时候 他new value 可能是一个普通对象 但是 this。value 可能是一个proxy对象
    if (!hasChange(this._value, value)) return;
    this._rawValue = value;
    this._value = convert(value);
    // 先修改value 再去通知
    this._value = value;
    triggerEffects(this.dep);
  }
}
function trackRefValue(ref) {
  if (isTacking()) {
    trackEffects(ref.dep);
  }
}
function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

export function ref(value) {
  return new RefImpl(value);
}
export function isRef(ref) {
  return !!ref._v_isRef;
}
export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}
export function proxyRefs(objectWithRef) {
  return new Proxy(objectWithRef, {
    get(target, key) {
      return unRef(Reflect.get(target, key));
    },
    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value);
      }
    },
  });
}
