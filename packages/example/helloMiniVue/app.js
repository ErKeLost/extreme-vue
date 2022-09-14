export const App = {
  render() {
    return h("div", "安东尼娅 erkelost" + this.name)
  },
  setup() {
    return {
      name: 'adny'
    }
  }
}