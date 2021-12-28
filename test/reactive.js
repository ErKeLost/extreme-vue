

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



class ReactiveEffect {
  private _fn:any;
  constructor(fn) {
    this._fn = fn
  }
  run() {
    // 我们执行当前的run 之后 我们 就需要 保存我们 依赖 利用我们的全局变量获取
    activeEffect = this  // 这个 this 值得 是我们当前实例对象 就是这个我们effect 传入的fn
    return this._fn()
  }
}

export function effect(fn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}


export function reactive(raw) {
  return new Proxy(raw, {
      get(target, key){
          const res = Reflect.get(target, key)
          // TODO 收集依赖
          track(target, key)
          return res
      },
      set(target,key,value){
          const res = Reflect.set(target,key,value)
          // TODO 触发依赖
          trigger(target, key)
          return res
      }
  })
}
// 收集的依赖 存在 deps里面 我们 是需要获取 effect 传入的fn 所以我们可以创建一个全局变量 /
let activeEffect
// 我们 的所有 结构就是 我们 需要 一个 目标对象去存 整个 target target 对应每一个 key  
// 然后 key里面放着我们所有的要存的并且一一对应的依赖
const targetMap = new WeakMap()
export function track(target, key) {
  // targetMap 是我们存放的一个数据结构 我们还需要判断当一开始 目标对象存储的数据结构没有的时候 所以
  // const depsMap = targetMap.get(target)
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  // deps 也是一样 我们没有 我们就需要创建
  let deps = depsMap.get(key)
  if (!deps) {
    deps = new Set()
    depsMap.set(key, deps)
    // 这时候我们就把所有的 对象 的key 的对应fn 的关系 一一对应起来
  }
  // 接下来我们就要对 我们不同的key 所产生的 对应依赖 fn 去存到整个 deps里面 那我们如何 才能把 当前 我们需要
  // 收集的依赖 存在 deps里面 我们 是需要获取 effect 传入的fn 所以我们可以创建一个全局变量 
  // 我们 创建所有的 依赖 fn 合集  因为依赖不可以重复 所以我们需要 创建一个set
  // const deps = new Set()
  deps.add(activeEffect)
}

export function tigger(target, key) {
  // 我们把我们之前 get 获取的所有fn 都取出来 去调用一下
  let depsMap = targetMap.get(target)
  let deps = depsMap.get(key)
  for(const dep of deps) {
    dep.run()
  }
}