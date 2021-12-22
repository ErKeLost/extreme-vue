

class Dep {
  constructor() {
    this.subscribers = new Set()
  }
  depend() {
    if (activeEffect) {
      this.subscribers.add(activeEffect)
    }
  }

  notify() {
    this.subscribers.forEach(effect => effect())
  }
}
const dep = new Dep()

let activeEffect = null
function watchEffect(effect) {
  activeEffect = effect
  dep.depend()
  effect()
  activeEffect = null
}
const targetMap = new WeakMap()
function getCurrentDep(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Dep()
    depsMap.set(key, dep)
  }
  return dep
}
const info = reactive({ counter: 100 })

function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const dep = getCurrentDep(target, key)
      dep.depend()
      return Reflect.get(target, key)
    },
    set(target, key, value) {
      const dep = getCurrentDep(target, key)
      const res = Reflect.set(target, key, value)
      dep.notify()
      return res
    }
  })
}
watchEffect(function () {
  console.log(targetMap);
  console.log(info.counter + 1);
})

info.counter += 100

// info.counter += 500