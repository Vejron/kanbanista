# Part 2 - Building the Kanban Board

Now that we have our project set up, we can start building the kanban board. In this part of the tutorial, we will create the basic structure of the board and add the ability to create new tasks.

## Cleaning Up

Before we start building the kanban board, let's clean up the project a bit. Remove all files from the `src/components` & `src/views` directory and delete the `src/assets/logo.png` file. We won't be needing them for this tutorial. Keep only the `main.css` file in the `src/assets` directory but replace its contents with the following:

```css
html,
body {
  height: 100%;
  display: flex;
  flex-direction: column;
}

#app {
  font-weight: normal;
  display: flex;
  flex-direction: column;
  flex: 1;
}

select {
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 10 6'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m1 1 4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 0.75em 0.75em;
  padding-right: 2.5rem;
  appearance: none;
}

.v-move,
.v-enter-active,
.v-leave-active {
  transition: 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
```

This is our only "global" CSS file. It contains some basic styles and a default transition for Vue animations. We will add more styles as we build the kanban board but those will be scoped specifically to each component and usually consist of only atomic UnoCss classes. On that note, UnoCss needs some setup to start working. Add the following imports to the top of the `src/main.ts` file:

```ts
import "./assets/main.css";
import "@unocss/reset/tailwind.css";
import "virtual:uno.css";
```

Then add a uno.config.ts file to the root of the project with the following content:

```ts
import { defineConfig, presetTypography, presetUno } from "unocss";
import transformerDirectives from "@unocss/transformer-directives";

export default defineConfig({
  presets: [presetUno(), presetTypography()],
  transformers: [transformerDirectives()],
});
```

This configuration file is then read by the UnoCss plugin and used to generate the necessary CSS for our project. To enable that we also need to add the plugin to the Vite configuration in the `vite.config.ts` file:

```ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";

export default defineConfig({
  plugins: [Vue(), UnoCSS()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
```
