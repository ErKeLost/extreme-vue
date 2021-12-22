import { reactive } from "../reactive";
describe("reactive", () => {
  it("happy path", () => {
    const orginal = { foo: 1 };
    const obversed = reactive(orginal);
    expect(obversed.foo).toBe(1);
    expect(obversed).not.toBe(orginal);
  });
});
