import { h } from "../packages/runtime-core/dist/index.mjs";

export const foo = {
  render() {
    const btn = h(
      "button",
      {
        onClick: this.emitAdd,
      },
      "emitAdd"
    );
    const foo = h("h2", {}, "h2 & foo");
    return h("h1", { class: "color" }, [foo, this.$slots, btn]);
  },
  setup(props, { emit }) {
    console.log(props);
    props.count = 10;
    const emitAdd = () => {
      console.log("emit add");
      emit("add", 456456465);
      emit("add-foo", 456456465);
    };
    return {
      msg: "我是foo子组件",
      emitAdd,
    };
  },
};
