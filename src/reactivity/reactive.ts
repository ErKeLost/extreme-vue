import { track, trigger } from "./effect";
// 抽离 readonly 和 reactive get获取
import { multipleHandlers, readonlyHandlers } from "./baseHandlers";
export function reactive(raw) {
  return createReactiveObject(raw, multipleHandlers);
}
export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers);
}
function createReactiveObject(raw, handlers) {
  return new Proxy(raw, handlers);
}
