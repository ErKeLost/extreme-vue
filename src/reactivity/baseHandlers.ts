import { track, trigger } from "./effect";

function createGetter(isReadonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key);
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
// 抽离 readonly 和 reactive set获取
function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);
    trigger(target, key);
    return res;
  };
}

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
