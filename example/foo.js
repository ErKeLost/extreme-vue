import { h } from "../packages/runtime-core/dist/index.mjs";

export const foo = {
  render() {
    return h("div", { class: "color" }, this.msg + this.count);
  },
  setup(props) {
    console.log(props);
    return {
      msg: "我是foo子组件",
    };
  },
};
