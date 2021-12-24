import { effect } from "../effect";
import { reactive } from "../reactive";
import { isRef, ref, unRef, proxyRefs } from "../ref";

describe("ref", () => {
  test("happy path", () => {
    const a = ref(1);
    expect(a.value).toBe(1);
  });
  test("reactive path", () => {
    const a = ref(1);
    let dummy;
    let call = 0;
    effect(() => {
      call++;
      dummy = a.value;
    });
    expect(call).toBe(1);
    expect(dummy).toBe(1);
    a.value = 2;
    expect(call).toBe(2);
    expect(dummy).toBe(2);
    // 如果我们是相同的值 就不需要调用trigger
    a.value = 2;
    expect(call).toBe(2);
    expect(dummy).toBe(2);
  });
  test("should make nested properties reactive", () => {
    const a = ref({ age: 10 });
    let dummy;
    effect(() => {
      dummy = a.value.age;
    });
    expect(dummy).toBe(10);
    a.value.age = 100;
    expect(dummy).toBe(100);
  });
  it("isRef", () => {
    const a = ref(1);
    const b = reactive({ age: 1 });
    expect(isRef(a)).toBe(true);
    expect(isRef(1)).toBe(false);
    expect(isRef(b)).toBe(false);
  });
  test("unRef", () => {
    const a = ref(1);
    const w = { age: 1 };
    const b = ref(w);
    expect(unRef(a)).toBe(1);
    expect(unRef(1)).toBe(1);
    console.log(ref(w).value === { age: 1 });
  });

  test("proxyRefs", () => {
    // 为什么我们在template中使用ref的时候 不需要 调用.value
    const user = {
      age: ref(10),
      name: "erkelost",
    };
    const proxyref = proxyRefs(user);
    expect(user.age.value).toBe(10);
    expect(proxyref.age).toBe(10);
    expect(proxyref.name).toBe("erkelost");
    proxyref.age = 10000;
    expect(proxyref.age).toBe(10000);
    expect(user.age.value).toBe(10000);
    proxyref.age = ref(10);
    expect(proxyref.age).toBe(10);
    expect(user.age.value).toBe(10);
  });
});
