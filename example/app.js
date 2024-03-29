import { h } from "../packages/runtime-core/dist/index.mjs";
import { foo } from "./foo.js";
window.self = null;
const app = {
  render() {
    window.self = this;
    return h(
      "div",
      {
        id: "root",
        class: ["red"],
        onClick() {
          // console.log("被点击了");
        },
        onMousedown() {
          // console.log("鼠标按下了");
        },
      },
      [
        h("div", { class: "" }, `hi mini-vue3 ${this.msg}`),
        h("div", { class: "red" }, "我是第一个子节点"),
        h("div", { class: "bbb" }, "我是第二个子节点"),
        h(foo, {
          count: 123,
          onAdd(res) {
            console.log(res, "我是app 组件发生的点击");
          },
          onAddFoo(res) {
            console.log("我是涮羊肉");
          }
        }),
      ]
    );
  },
  setup() {
    return {
      msg: "我是 msg",
    };
  },
};

export default app;
