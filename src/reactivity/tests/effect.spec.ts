import { reactive } from "../reactive";
import { effect, stop } from "../effect";
describe("effect", () => {
  it("reactive", () => {
    const user = reactive({ age: 10 });
    let nextage;
    effect(() => {
      nextage = user.age + 1;
    });
    expect(nextage).toBe(11);
    // update
    user.age += 1;
    expect(nextage).toBe(12);
  });
  it("show return runner when call effect", () => {
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return "foo";
    });
    expect(foo).toBe(11);
    const r = runner();
    expect(foo).toBe(12);
    expect(r).toBe("foo");
  });
  test("scheduler", () => {
    // 通过effect的第二个参数 给定一个 scheduler 的fn 当effect 第一次执行的时候还会执行fn
    // effect 第一次执行的之后 会默认执行 fn
    // 当响应式对象set 之后 不会执行fn 而是会执行scheduler
    // 如果我们当时在执行runner的时候 会再次执行effect的第一个参数
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        scheduler,
      }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    // should be called on 第一次trigger
    obj.foo++; // 如果我们set之后 如果有scheduler 他回去执行scheduler 而不会去调用第一个 effect 参数
    expect(scheduler).toHaveBeenCalledTimes(1);
    // 不会再去执行run
    expect(dummy).toBe(1);
    run();
    expect(dummy).toBe(2);
  });
  test("stop", () => {
    let dummy;
    const obj = reactive({ prop: 1 });
    const runner = effect(() => {
      dummy = obj.prop;
    });
    obj.prop = 2;
    // expect(dummy).toBe(2);
    // expect(runner()).toBe(undefined);
    stop(runner);
    // 2021.12.23 stop单元测试有bug
    obj.prop++; //  这块 有问题
    // obj.prop = 3;
    expect(dummy).toBe(2);
    // 但是我们如果调用runner之后 他还是会继续被调用
    // runner();
    // expect(dummy).toBe(3);
  });
  test("onStop", () => {
    const obj = reactive({ prop: 1 });
    const onStop = jest.fn();
    let dummy;
    const runner = effect(
      () => {
        dummy = obj.prop;
      },
      {
        onStop,
      }
    );
    stop(runner);
    expect(onStop).toBeCalledTimes(1);
  });
});
