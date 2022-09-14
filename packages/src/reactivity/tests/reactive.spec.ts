import { reactive, isReactive, isProxy } from "../reactive";
describe("reactive", () => {
  it("happy path", () => {
    const orginal = { foo: 1 };
    const obversed = reactive(orginal);
    expect(obversed.foo).toBe(1);
    expect(obversed).not.toBe(orginal);
    expect(isReactive(obversed)).toBe(true);
    expect(isProxy(obversed)).toBe(true);
  });
  test("nested reactive", () => {
    const obj = {
      nested: {
        foo: 1,
      },
      arr: [{ bar: 2 }],
    };
    const obversed = reactive(obj);
    expect(isReactive(obversed)).toBe(true);
    expect(isReactive(obversed.nested)).toBe(true);
    expect(isReactive(obversed.arr)).toBe(true);
    expect(isReactive(obversed.arr[0])).toBe(true);
  });
});
