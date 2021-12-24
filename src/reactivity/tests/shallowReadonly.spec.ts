import { isReadonly, shallowReadonly } from "../reactive";

describe("shallowReadonly", () => {
  test("should not make non-reactive properties reactive", () => {
    const props = shallowReadonly({ m: { n: 1 } });
    expect(isReadonly(props)).toBe(true);
    expect(isReadonly(props.m)).toBe(false);
  });
  it("wran path", () => {
    console.warn = jest.fn();
    const user = shallowReadonly({ age: 10 });
    user.age = 111;
    expect(console.warn).toBeCalled();
  });
});
