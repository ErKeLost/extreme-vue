import { defineConfig } from "vitepress";

const ogDescription = "Next Generation Frontend Tooling";
const ogImage = "https://main.vitejs.dev/og-image.png";
const ogTitle = "Vite";
const ogUrl = "https://main.vitejs.dev";

export default defineConfig({
  title: "Vite",
  description: "Next Generation Frontend Tooling",

  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: ogTitle }],
    ["meta", { property: "og:image", content: ogImage }],
    ["meta", { property: "og:url", content: ogUrl }],
    ["meta", { property: "twitter:description", content: ogDescription }],
    ["meta", { property: "twitter:title", content: ogTitle }],
    ["meta", { property: "twitter:card", content: "summary_large_image" }],
    ["meta", { property: "twitter:image", content: ogImage }],
    ["meta", { property: "twitter:url", content: ogUrl }],
  ],

  vue: {
    reactivityTransform: true,
  },

  themeConfig: {
    logo: "/logo.svg",

    editLink: {
      pattern: "https://github.com/vitejs/vite/edit/main/docs/:path",
      text: "Suggest changes to this page",
    },

    socialLinks: [
      { icon: "twitter", link: "https://twitter.com/vite_js" },
      { icon: "discord", link: "https://chat.vitejs.dev" },
      { icon: "github", link: "https://github.com/vitejs/vite" },
    ],

    algolia: {
      apiKey: "b573aa848fd57fb47d693b531297403c",
      indexName: "vitejs",
      searchParameters: {
        facetFilters: ["tags:en"],
      },
    },

    carbonAds: {
      code: "CEBIEK3N",
      placement: "vitejsdev",
    },

    localeLinks: {
      text: "English",
      items: [
        { text: "简体中文", link: "https://cn.vitejs.dev" },
        { text: "日本語", link: "https://ja.vitejs.dev" },
        { text: "Español", link: "https://es.vitejs.dev" },
      ],
    },

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2019-present Evan You & Vite Contributors",
    },

    nav: [
      { text: "reactivity", link: "/reactivity/", activeMatch: "/reactivity/" },
      {
        text: "runtime-core",
        link: "/runtime-core/",
        activeMatch: "/runtime-core/",
      },
      {
        text: "runtime-dom",
        link: "/runtime-dom/",
        activeMatch: "/runtime-dom/",
      },
      {
        text: "compiler-core",
        link: "/compiler-core/",
        activeMatch: "/compiler-core/",
      },
      {
        text: "shared",
        items: [
          {
            text: "v2.x (stable)",
            link: "https://v2.vitejs.dev",
          },
        ],
      },
    ],

    sidebar: {
      "/reactivity/": [
        {
          text: "reactivity",
          items: [
            {
              text: "实现 effect & reactive",
              link: "/guide/why",
            },
            {
              text: "effect 返回 runner",
              link: "/guide/",
            },
            {
              text: "effect 的 scheduler",
              link: "/guide/features",
            },
            {
              text: "effect 的 stop 功能",
              link: "/guide/using-plugins",
            },
            {
              text: "优化 Effect 代码 onStop 功能",
              link: "/guide/dep-pre-bundling",
            },
            {
              text: "readonly 优化代码",
              link: "/guide/assets",
            },
            {
              text: "实现 isReactive 和 isReadonly",
              link: "/guide/build",
            },
            {
              text: "stop 优化",
              link: "/guide/static-deploy",
            },
            {
              text: "reactive 和 readonly 嵌套对象转换功能",
              link: "/guide/env-and-mode",
            },
            {
              text: "实现shadowReadonly",
              link: "/guide/ssr",
            },
            {
              text: "Is Proxy",
              link: "/guide/backend-integration",
            },
            {
              text: "Ref",
              link: "/guide/comparisons",
            },
            {
              text: "实现 isRef 和 unRef 功能",
              link: "/guide/migration",
            },
            {
              text: "实现 proxyRefs 功能",
              link: "/guide/a",
            },
            {
              text: "实现 computed 计算属性",
              link: "/guide/b",
            },
          ],
        },
        {
          text: "APIs",
          items: [
            {
              text: "Plugin API",
              link: "/guide/api-plugin",
            },
            {
              text: "HMR API",
              link: "/guide/api-hmr",
            },
            {
              text: "JavaScript API",
              link: "/guide/api-javascript",
            },
            {
              text: "Config Reference",
              link: "/config/",
            },
          ],
        },
      ],
      "/runtime-core/": [
        {
          text: "runtime-core",
          items: [
            {
              text: "实现初始化 component 主流程",
              link: "/runtime-core/",
            },
            {
              text: "Shared Options",
              link: "/config/shared-options",
            },
            {
              text: "Server Options",
              link: "/config/server-options",
            },
            {
              text: "Build Options",
              link: "/config/build-options",
            },
            {
              text: "Preview Options",
              link: "/config/preview-options",
            },
            {
              text: "Dep Optimization Options",
              link: "/config/dep-optimization-options",
            },
            {
              text: "SSR Options",
              link: "/config/ssr-options",
            },
            {
              text: "Worker Options",
              link: "/config/worker-options",
            },
          ],
        },
      ],
    },
  },
});
