import { createVNode } from "./vnode";
import { render } from "./renderer";
export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // 先转换成vnode

      // 后续所有操作都会基于vnode

      const vnode = createVNode(rootComponent);

      render(vnode, rootContainer);
    },
  };
}

// import { createVNode } from "./vnode";

// export function createAppAPI(render) {
//   return function createApp(rootComponent) {
//     const app = {
//       _component: rootComponent,
//       mount(rootContainer) {
//         console.log("基于根组件创建 vnode");
//         const vnode = createVNode(rootComponent);
//         console.log("调用 render，基于 vnode 进行开箱");
//         render(vnode, rootContainer);
//       },
//     };

//     return app;
//   };
// }
