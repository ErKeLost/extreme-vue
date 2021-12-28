
export function createComponentInstance(vnode: any) {
  const component = {
    vnode,
    type: vnode.type,
  }
  return component
}

export function setupComponent(instance: { vnode: any }) {
  // initProps()
  // initSlots()

  setupStatefulComponent(instance)
}
function setupStatefulComponent(instance) {
  const component = instance.type
  const { setup } = component

  if (setup) {
    const setupResult = setup()

    handleSetupResult(instance,setupResult)
  }
}


function handleSetupResult(instance,setupResult: any) {
  // function  object
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
  // TODO FUNCTION
}

function finishComponentSetup(instance: any) {
  const component = instance.type
  if (!component.render) {
    instance.render = component.render
  }
}

