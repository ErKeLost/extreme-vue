import { h } from "../packages/runtime-core/dist/index.mjs";

export const foo = {
  render() {
    h("div", { style: { color: "#abf" } }, this.msg);
  },
  setup() {
    return {
      msg: "我是foo子组件",
    };
  },
};
