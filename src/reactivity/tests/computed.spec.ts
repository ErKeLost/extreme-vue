import { computed } from "../computed";
import { reactive } from "../reactive";

describe("computed", () => {
  it("happy path", () => {
    const user = reactive({ age: 10 });
    const age = computed(() => {
      return user.age;
    });
    expect(age.value).toBe(10);
  });
  test("computed lzay 执行机制", () => {
    const value = reactive({ foo: 1 });
    const getter = jest.fn(() => {
      return value.foo;
    });
    const cValue = computed(getter);
    // lazy 执行 如果我们不去调用 cvalue  那么 computed 不会执行
    expect(getter).not.toHaveBeenCalled();
    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);
    // 再一次 触发 cvalue的时候 触发 cvalue的get 方法
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1);
    value.foo = 2;
    expect(getter).toHaveBeenCalledTimes(1);
    expect(cValue.value).toBe(2);
  });
});
