---
title: 实现初始化 component 主流程
---

# 实现初始化 component 主流程

.vue 文件 template 模版最终都被编译成 render 函数 和 setup 函数,
我们先实现从组件模式下的流程

```ts
const app = {
  render() {
    return h(
      "div",
      {
        id: "root",
        class: ["red", "blue"],
      },
      `hi mini-vue3 ${this.msg}`
    );
  },
  setup() {
    return {
      msg: "我是 msg",
    };
  },
};
```

我们需要创建一个 createApp 函数 接收一个根组件， 然后返回一个对象，这个对象有一个 mount 函数这个函数我们需要挂载到我们指定的 dom 节点上

```ts
function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // 根组件接下来会有一堆其他的子组件 我们所有的操作 都要基于vnode 处理
      const vnode = createVNode(rootComponent);
      // 然后我们在把 vnode 解析出来之后 我们在去渲染到 我们给定的 rootcontainer
      render(vnode, rootContainer);
    },
  };
}
```

然后我们第一步先生成一个虚拟节点 虚拟 dom 实际就是一个对象
我们当前传递的是根 app 组件 type 就是我们当前的 app 实例

```ts
function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
  };
  return vnode;
}
```

然后我们去实现 render 函数 接收一个 vnode 并且需要一个 contianer 挂载

```ts
function render(vnode, container) {
  // 调用patch方法 进行后续判断type 是否是 标签还是 组件 children 递归处理
  // 我们先判断 类型进行递归处理
  patch(vnode, container);
}

function patch(vnode, container) {
  // 处理组件
  processComponent(vnode, container);
}
// 处理组件流程
function processComponent(vnode, container) {
  mountComponent(vnode, container);
}
// 挂载组件
function mountComponent(vnode, container) {
  // 拿到当前组件实例 我们先简单一点 就是虚拟节点
  const instance = createComponentInstance(vnode, container);
  // 设置setupcomponent
  setupComponent(instance);
}

// 创建组件实例 我们需要抽离出来一个instance 后续挂载什么 props啊 slots 啥的
function createComponentInstance(vnode, container) {
  const component = {
    vnode,
    type: vnode.type
  };
  return component;
}

function setupComponent(instance) {
  // 初始化 props 和 初始化 slots
  // initProps()
  // initSlots()

  setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
  const component = instance.vnode.type;
  const { setup } = component;
  if (setup) {
    // 这个setup 可能会返回一个function 或者 返回一个object
    // 如果返回一个function 那么就是代表 setup返回的是一个render 函数
    // 如果返回的是一个object 那么我们可以直接注入到当前组件上下文中
    const setupResult = setup();
    // 处理result结果
    handleSetupResult(instance, setupResult);
  }
}

// 处理 result 是什么类型的结果
function handleSetupResult(instance, setupResult) {
  // 我们先只实现setup返回对象的情况 就是带有返回值的情况
  if(type of setupResult === 'object') {
    // 我们就把 instance 中 注入一下 我们返回的上下文数据
    instance.setupState = setupResult
  }
  // 因为我们setup返回的是一个对象， 那么我们就要保证我们instance 实例中必须有render函数
  finishComponentSetup(instance) {
    const component = instance.type
    // 写了render 我们就给实例也赋值一个render
    if (component.render) {
      instance.render = component.render
    }
  }
}

// 我们在刚才挂载 component的时候先把instance 获取出来 然后配置 setup的state
// 接下来我们就需要调用render函数 类似一个 render effect
function mountComponent(vnode, container) {
  // 拿到当前组件实例 我们先简单一点 就是虚拟节点
  const instance = createComponentInstance(vnode, container);
  // 设置setupcomponent
  setupComponent(instance);

  // effect 函数
  setupRenderEffect(instance, container)
}

// 开始渲染调用render 函数
function setupRenderEffect(instance, container) {
  const subTree = instance.render()
  // vnode 树 是一个 h函数
  // 我们需要在继续调用patch
  // 我们返回的是一个 element 在处理 element的时候
  patch(subTree, container)
}

// 我们需要判断是不是element
function patch(vnode, container) {
  // 处理组件
  // 判断vnode 是不是一个element 如果是 element 就处理元素类型
  if (typeof vnode.type === 'string') {
    processElement(vnode, container)
  } else if (isObject(vnode.type) {
    processComponent(vnode, container);
  }
}

// 处理element
function processElement(vnode, container) {
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  const el = document.createElement(vnode.type);
  el.textContent = vnode.children
  for (const item in vnode.props) {
    el.setAttribute(item, vnode.props[item])
  }
  container.append(el)
}

```
