import App from "./app.js";
import { createApp } from "../packages/runtime-core/dist/index.mjs";
const rootContainer = document.querySelector("#app");
createApp(App).mount(rootContainer);
