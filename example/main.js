import App from "./app.js";
import { createApp } from "../packages/runtime-core/dist/index.mjs";
const rootContainer = document.querySelector("#app");
console.log(rootContainer);
createApp(App).mount(rootContainer);
