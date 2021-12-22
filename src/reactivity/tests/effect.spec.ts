import { reactive } from "../reactive";
import { effect } from "../effect";
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
});
