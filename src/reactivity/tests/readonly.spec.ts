import { readonly } from "../reactive";

describe("readonly", () => {
  it("happy path", () => {
    const origianl = { foo: "foo", bar: { baz: "bar" } };
    const wrapped = readonly(origianl);
    expect(wrapped).not.toBe(origianl);
    expect(wrapped.foo).toBe("foo");
  });

  it("wran path", () => {
    console.warn = jest.fn();
    const user = readonly({ age: 10 });
    user.age = 111;
    expect(console.warn).toBeCalled();
  });
});
