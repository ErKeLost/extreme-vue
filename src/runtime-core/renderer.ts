import { createComponentInstance, setupComponent } from "./component"

export function render(vnode, container) {
  // 调用patch 方法 方便 调用后续递归的处理
  patch(vnode, container)
}

function patch(vnode, container) {

  // 处理组件
  processComponent(vnode, container)
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}
function mountComponent(vnode: any, container: any) {
  // 抽离一个instance 表示组件实例
  const instance = createComponentInstance(vnode)
  // 调用setup
  setupComponent(instance)

  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container) {
  const subTree = instance.render()
  // vnode 调用 patch
  // vode 调用 element 挂载 mountElement
  patch(subTree, container)
}

