import { h } from "../packages/runtime-core/dist/index.mjs";

const app = {
  render() {
    return h(
      "div",
      {
        id: "root",
        class: ["red"],
      },
      // `hi mini-vue3 ${this.msg}`
      [
        h("div", { class: "red" }, "我是第一个子节点"),
        h("div", { class: "bbb" }, "我是第二个子节点"),
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
