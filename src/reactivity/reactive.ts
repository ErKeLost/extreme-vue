export const enum rectiveFlags {
  IS_REACTIVE = "_v_isReactive",
  IS_READONLY = "_v_isReadonly",
}

// 抽离 readonly 和 reactive get获取
import {
  multipleHandlers,
  readonlyHandlers,
  shallowHandlers,
} from "./baseHandlers";
export function reactive(raw) {
  return createReactiveObject(raw, multipleHandlers);
}
export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers);
}
export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowHandlers);
}

export function isReactive(raw) {
  return !!raw[rectiveFlags.IS_REACTIVE];
}
export function isReadonly(raw) {
  return !!raw[rectiveFlags.IS_READONLY];
}

export function isProxy(raw) {
  return isReactive(raw) || isReadonly(raw);
}
function createReactiveObject(raw, handlers) {
  return new Proxy(raw, handlers);
}
