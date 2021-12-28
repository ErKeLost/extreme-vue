import { render } from "./renderer"
import { createVNode } from "./vnode"

export function createApp (rootComponent) {
  return {
    mount(rootContainer) {
      // 先转换成虚拟节点
      // component 转换成虚拟节点
      // 所有的逻辑操作 都会基于虚拟节点
      const vnode = createVNode(rootComponent)
      // 进一步处理
      render(vnode, rootContainer)
    }
  }
}


