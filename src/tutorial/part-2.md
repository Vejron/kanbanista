# Part 2 - Styling with UnoCss

In this part of the tutorial, we will set up UnoCss in our project and start styling our kanban board. UnoCss is a utility-first CSS framework inspired by Tailwind CSS but faster and generally less hassle. UnoCss generates only the CSS that is actually used in the project. This makes it a great choice for Vue 3 projects as it allows us to use atomic classes without worrying about the final bundle size.

## Cleaning up and configuring UnoCss

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

Then add a `uno.config.ts` file to the root of the project with the following content:

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

## Fixing the application state

Right now our application is not working and you probably see an error message in the browser, complaining about a missing component and incorrect router configuration. Lets fix that by removing all the routes from the `src/router/index.ts`

```ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: []
})

export default router
```

And replacing `src/App.vue` with the following:

```vue
<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <header class="flex justify-center">
    <h1
      class="first-letter:text-yellow-400 first-letter:text-7xl text-6xl tracking-tight font-bold my-4 bg-gradient-to-r from-purple-600 via-orange-500 to-purple-600 text-transparent bg-clip-text">
      Kanbanista
    </h1>
  </header>
  <div class="w-full bg-gradient-to-r from-purple-900 via-orange-500 to-purple-900 h-.5 mb-6"></div>

  <main class="flex flex-col flex-grow mb-6">
    <RouterView />
  </main>
</template>
```

To get a nice radial gradient backdrop wee need to add the following to the `index.html` file:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body class="bg-black">
    <div
      class="bg-gradient-radial from-slate-900 via-slate-900 to-purple-900/60"
      id="app"
    ></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

Now the application should be in a working state and we can start building the kanban board in the next part of the tutorial.
