import { track, trigger } from "./effect";
import { reactive, readonly, reactiveFlags } from "./reactive";
import { extend, isObject } from "../shared";
function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key) {
    if (key === reactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === reactiveFlags.IS_READONLY) {
      return !!isReadonly;
    }
    const res = Reflect.get(target, key);
    if (shallow) {
      return res;
    }
    // 通过判断res 是否为 reactive
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res);
    }
    if (!isReadonly) {
      track(target, key);
    }
    return res;
  };
}
// 缓存机制 每次 初始化 创建一个
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);
// 抽离 readonly 和 reactive set获取
function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);
    trigger(target, key);
    return res;
  };
}

// reactive
export const multipleHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
  get: readonlyGet,
  set: (target, key, value) => {
    console.warn(`key:${key} set 失败 因为 target 是 readonly ${target}`);
    return true;
  },
};
export const shallowHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
});
