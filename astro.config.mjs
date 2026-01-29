// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import compress from "astro-compress";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://KT20201224.github.io",
  integrations: [
    mdx(),
    sitemap(),
    compress({
      CSS: true,
      HTML: {
        "html-minifier-terser": {
          removeComments: true,
          collapseWhitespace: true,
        },
      },
      Image: false, // Already optimized by Astro
      JavaScript: true,
      SVG: false,
    }),
  ],
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    build: {
      cssCodeSplit: true,
    },
  },
});
