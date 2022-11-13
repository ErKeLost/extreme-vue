import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlots";
import { proxyRefs, shallowReadonly } from "../../reactivity/src/index";
import { emit } from "./componentEmits";
export function createComponentInstance(vnode: any) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    emit: () => {},
  };
  component.emit = emit.bind(null, component) as any;
  return component;
}

export function setupComponent(instance) {
  // TODO
  // props
  initProps(instance, instance.vnode.props);
  // slots
  // initSlots()

  // 有状态的组件实例
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  // 自从组件的情况下 type 就代表一个组件 type 就是 rootComponent
  const component = instance.type;

  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
  // 拿到用户传入的setup
  const { setup } = component;
  if (setup) {
    // 如果用户传入了setup
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
    console.log(setupResult);

    // setup 可能会返回一个函数 或者 一个对象 如果她返回一个函数 就说明她返回的是render 函数
    // 如果返回的是一个对象 就注册到当前组件的上下文中 然后疯狂递归 patch
    // 解析 setupResult 可能返回的是一个函数 也可能返回的是一个对象 函数 就是 render函数 tsx 对象就是 setup 语法
    // 解析 setupResult方法
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance, setupResult: any) {
  // instance 是 组件解析出来的 vnode setupresutl 可能是 function 还可能是 返回
  // 他又两种可能 一种是 object 一种 是function
  // TODO function

  // 解析对象

  if (typeof setupResult === "object") {
    // 把组件 返回值 放到实例上下文
    instance.setupState = setupResult;
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const component = instance.type;

  if (component.render) {
    instance.render = component.render;
  }
}
// import { initProps } from "./componentProps";
// import { initSlots } from "./componentSlots";
// import { emit } from "./componentEmits";
// import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
// import { proxyRefs, shallowReadonly } from "@relaxed/reactivity";
// export function createComponentInstance(vnode, parent) {
//   const instance = {
//     type: vnode.type,
//     vnode,
//     next: null, // 需要更新的 vnode，用于更新 component 类型的组件
//     props: {},
//     parent,
//     provides: parent ? parent.provides : {}, //  获取 parent 的 provides 作为当前组件的初始化值 这样就可以继承 parent.provides 的属性了
//     proxy: null,
//     isMounted: false,
//     attrs: {}, // 存放 attrs 的数据
//     slots: {}, // 存放插槽的数据
//     ctx: {}, // context 对象
//     setupState: {}, // 存储 setup 的返回值
//     emit: () => {},
//   };

//   // 在 prod 坏境下的 ctx 只是下面简单的结构
//   // 在 dev 环境下会更复杂
//   instance.ctx = {
//     _: instance,
//   };

//   // 赋值 emit
//   // 这里使用 bind 把 instance 进行绑定
//   // 后面用户使用的时候只需要给 event 和参数即可
//   instance.emit = emit.bind(null, instance) as any;

//   return instance;
// }

// export function setupComponent(instance) {
//   // 1. 处理 props
//   // 取出存在 vnode 里面的 props
//   const { props, children } = instance.vnode;
//   initProps(instance, props);
//   // 2. 处理 slots
//   initSlots(instance, children);

//   // 源码里面有两种类型的 component
//   // 一种是基于 options 创建的
//   // 还有一种是 function 的
//   // 这里处理的是 options 创建的
//   // 叫做 stateful 类型
//   setupStatefulComponent(instance);
// }

// function setupStatefulComponent(instance) {
//   // todo
//   // 1. 先创建代理 proxy
//   console.log("创建 proxy");

//   // proxy 对象其实是代理了 instance.ctx 对象
//   // 我们在使用的时候需要使用 instance.proxy 对象
//   // 因为 instance.ctx 在 prod 和 dev 坏境下是不同的
//   instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
//   // 用户声明的对象就是 instance.type
//   // const Component = {setup(),render()} ....
//   const Component = instance.type;
//   // 2. 调用 setup

//   // 调用 setup 的时候传入 props
//   const { setup } = Component;
//   if (setup) {
//     // 设置当前 currentInstance 的值
//     // 必须要在调用 setup 之前
//     setCurrentInstance(instance);

//     const setupContext = createSetupContext(instance);
//     // 真实的处理场景里面应该是只在 dev 环境才会把 props 设置为只读的
//     const setupResult =
//       setup && setup(shallowReadonly(instance.props), setupContext);

//     setCurrentInstance(null);

//     // 3. 处理 setupResult
//     handleSetupResult(instance, setupResult);
//   } else {
//     finishComponentSetup(instance);
//   }
// }

// function createSetupContext(instance) {
//   console.log("初始化 setup context");
//   return {
//     attrs: instance.attrs,
//     slots: instance.slots,
//     emit: instance.emit,
//     expose: () => {}, // TODO 实现 expose 函数逻辑
//   };
// }

// function handleSetupResult(instance, setupResult) {
//   // setup 返回值不一样的话，会有不同的处理
//   // 1. 看看 setupResult 是个什么
//   if (typeof setupResult === "function") {
//     // 如果返回的是 function 的话，那么绑定到 render 上
//     // 认为是 render 逻辑
//     // setup(){ return ()=>(h("div")) }
//     instance.render = setupResult;
//   } else if (typeof setupResult === "object") {
//     // 返回的是一个对象的话
//     // 先存到 setupState 上
//     // 先使用 @vue/reactivity 里面的 proxyRefs
//     // 后面我们自己构建
//     // proxyRefs 的作用就是把 setupResult 对象做一层代理
//     // 方便用户直接访问 ref 类型的值
//     // 比如 setupResult 里面有个 count 是个 ref 类型的对象，用户使用的时候就可以直接使用 count 了，而不需要在 count.value
//     // 这里也就是官网里面说到的自动结构 Ref 类型
//     instance.setupState = proxyRefs(setupResult);
//   }

//   finishComponentSetup(instance);
// }

// function finishComponentSetup(instance) {
//   // 给 instance 设置 render

//   // 先取到用户设置的 component options
//   const Component = instance.type;

//   if (!instance.render) {
//     // 如果 compile 有值 并且当组件没有 render 函数，那么就需要把 template 编译成 render 函数
//     if (compile && !Component.render) {
//       if (Component.template) {
//         // 这里就是 runtime 模块和 compile 模块结合点
//         const template = Component.template;
//         Component.render = compile(template);
//       }
//     }

//     instance.render = Component.render;
//   }

//   // applyOptions()
// }

// function applyOptions() {
//   // 兼容 vue2.x
//   // todo
//   // options api
// }

// let currentInstance = {};
// // 这个接口暴露给用户，用户可以在 setup 中获取组件实例 instance
// export function getCurrentInstance(): any {
//   return currentInstance;
// }

// export function setCurrentInstance(instance) {
//   currentInstance = instance;
// }

// let compile;
// export function registerRuntimeCompiler(_compile) {
//   compile = _compile;
// }
