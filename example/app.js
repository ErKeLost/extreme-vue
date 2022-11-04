import { h } from '../packages/runtime-core/dist/index.mjs'

const app = {
  render() {
    return h("div",{
      id: 'root',
      class: ['red', 'blue']
    }, `hi mini-vue3 ${this.msg}`);
  },
  setup() {
    return {
      msg: "我是 msg",
    };
  },
};

export default app;
