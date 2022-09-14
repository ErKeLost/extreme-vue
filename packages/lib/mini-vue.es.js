function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
    };
    return component;
}
function setupComponent(instance) {
    // initProps()
    // initSlots()
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const component = instance.type;
    const { setup } = component;
    if (setup) {
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // function  object
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
    // TODO FUNCTION
}
function finishComponentSetup(instance) {
    const component = instance.type;
    if (!component.render) {
        instance.render = component.render;
    }
}

function render(vnode, container) {
    // 调用patch 方法 方便 调用后续递归的处理
    patch(vnode);
}
function patch(vnode, container) {
    // 处理组件
    processComponent(vnode);
}
function processComponent(vnode, container) {
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    // 抽离一个instance 表示组件实例
    const instance = createComponentInstance(vnode);
    // 调用setup
    setupComponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    // vnode 调用 patch
    // vode 调用 element 挂载 mountElement
    patch(subTree);
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children
    };
    return vnode;
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 先转换成虚拟节点
            // component 转换成虚拟节点
            // 所有的逻辑操作 都会基于虚拟节点
            const vnode = createVNode(rootComponent);
            // 进一步处理
            render(vnode);
        }
    };
}

export { createApp };
