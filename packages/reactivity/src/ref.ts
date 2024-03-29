// import { trackEffects, triggerEffects, isTracking } from "./effect";
// import { createDep } from "./dep";
import { isObject, hasChanged } from "../../shared/src/index";
import { reactive } from "./reactive";
import { trackEffect, triggerEffect, isTracking } from "./effect";

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

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffect(ref.dep);
  }
}

// 判断 返回 reactive 对象 还是普通对象
function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

// export class RefImpl {
//   private _rawValue: any;
//   private _value: any;
//   public dep;
//   public __v_isRef = true;

//   constructor(value) {
//     this._rawValue = value;
//     // 看看value 是不是一个对象，如果是一个对象的话
//     // 那么需要用 reactive 包裹一下
//     this._value = convert(value);
//     this.dep = createDep();
//   }

//   get value() {
//     // 收集依赖
//     trackRefValue(this);
//     return this._value;
//   }

//   set value(newValue) {
//     // 当新的值不等于老的值的话，
//     // 那么才需要触发依赖
//     if (hasChanged(newValue, this._rawValue)) {
//       // 更新值
//       this._value = convert(newValue);
//       this._rawValue = newValue;
//       // 触发依赖
//       triggerRefValue(this);
//     }
//   }
// }

// export function ref(value) {
//   return createRef(value);
// }

// function convert(value) {
//   return isObject(value) ? reactive(value) : value;
// }

// function createRef(value) {
//   const refImpl = new RefImpl(value);

//   return refImpl;
// }

// export function triggerRefValue(ref) {
//   triggerEffects(ref.dep);
// }

// export function trackRefValue(ref) {
//   if (isTracking()) {
//     trackEffects(ref.dep);
//   }
// }

// // 这个函数的目的是
// // 帮助解构 ref
// // 比如在 template 中使用 ref 的时候，直接使用就可以了
// // 例如： const count = ref(0) -> 在 template 中使用的话 可以直接 count
// // 解决方案就是通过 proxy 来对 ref 做处理

// const shallowUnwrapHandlers = {
//   get(target, key, receiver) {
//     // 如果里面是一个 ref 类型的话，那么就返回 .value
//     // 如果不是的话，那么直接返回value 就可以了
//     return unRef(Reflect.get(target, key, receiver));
//   },
//   set(target, key, value, receiver) {
//     const oldValue = target[key];
//     if (isRef(oldValue) && !isRef(value)) {
//       return (target[key].value = value);
//     } else {
//       return Reflect.set(target, key, value, receiver);
//     }
//   },
// };

// // 这里没有处理 objectWithRefs 是 reactive 类型的时候
// // TODO reactive 里面如果有 ref 类型的 key 的话， 那么也是不需要调用 ref.value 的
// // （but 这个逻辑在 reactive 里面没有实现）
// export function proxyRefs(objectWithRefs) {
//   return new Proxy(objectWithRefs, shallowUnwrapHandlers);
// }

// // 把 ref 里面的值拿到
// export function unRef(ref) {
//   return isRef(ref) ? ref.value : ref;
// }

// export function isRef(value) {
//   return !!value.__v_isRef;
// }
