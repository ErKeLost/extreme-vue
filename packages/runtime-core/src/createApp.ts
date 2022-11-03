// import { createVNode } from "./vnode";
// import { render } from "./renderer";
// export function createApp(rootComponent) {
//   return {
//     mount(rootContainer) {
//       // 先转换成vnode

import { render } from "./renderer";
import { createVNode } from "./vnode";

//       // 后续所有操作都会基于vnode

//       const vnode = createVNode(rootComponent);

//       render(vnode, rootContainer);
//     },
//   };
// }

// // import { createVNode } from "./vnode";

// // export function createAppAPI(render) {
// //   return function createApp(rootComponent) {
// //     const app = {
// //       _component: rootComponent,
// //       mount(rootContainer) {
// //         console.log("基于根组件创建 vnode");
// //         const vnode = createVNode(rootComponent);
// //         console.log("调用 render，基于 vnode 进行开箱");
// //         render(vnode, rootContainer);
// //       },
// //     };

// //     return app;
// //   };
// // }

// 创建 createapp 函数
// 带入一个 app 组件 然后返回 mount 函数 挂载 rootContainer dom 节点
export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // 所有的逻辑操作都会转换成虚拟节点
      // 都是基于 虚拟节点做处理
      const vnode = createVNode(rootComponent);
      // 然后调用 render 函数 渲染到 rootcontainer 上
      render(vnode, rootContainer);
    },
  };
}
