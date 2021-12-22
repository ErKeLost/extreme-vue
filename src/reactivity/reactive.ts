import { track, trigger } from "./effect";

export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const res = Reflect.get(target, key);
      // todo 依赖收集
      track(target, key);
      return res;
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value);
      trigger(target, key);
      return res;
    },
  });
}

// export function reactive(raw) {
//   return new Proxy(raw, {
//     get(target, key) {
//       track(target, key);
//       return Reflect.get(target, key);
//     },
//     set(target, key, value) {
//       trigger(target, key);
//       return Reflect.set(target, key, value);
//     },
//   });
// }
