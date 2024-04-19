# Part 2 - Styling

In this part of the tutorial we will clean up our project a bit and start styling our application. We will use **UnoCss** for styling. If you are not familiar with UnoCss, it is a utility-first CSS framework inspired by [Tailwind CSS](https://tailwindcss.com/docs/utility-first) but faster and generally less hassle.

## Why use UnoCss?

When people first start using utility classes they often think they are a hack or a workaround for not knowing how to write proper CSS. I'm not saying it that's not true, but utility classes have some very real benefits:

- **You aren’t wasting energy inventing class names**. No more adding silly class names like sidebar-inner-wrapper just to be able to style something, and no more agonizing over the perfect abstract name for something that’s really just a flex container.
- **Your CSS stops growing**. Using a traditional approach, your CSS files get bigger every time you add a new feature. With utilities, everything is reusable so you rarely need to write new CSS.
- **Making changes feels safer**. CSS is global and you never know what you’re breaking when you make a change. Classes in your HTML are local, so you can change them without worrying about something else breaking.

## Cleaning up and some global CSS

Remove all files from the `src/components` & `src/views` directory and delete the `src/assets/logo.png` file. We won't be needing them for this tutorial. Keep only the `main.css` file in the `src/assets` directory but replace it with the following content:

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

This is our only "global" CSS file. It contains some basic styles and a default transition for Vue animations. We will add more styles as we continue to build our application, but those will be scoped specifically to each component and usually consist of only atomic UnoCSS classes.

## Configuring UnoCss

UnoCSS needs some setup to start working. Add the following imports to the top of the `src/main.ts` file:

```ts
import "./assets/main.css"
import "@unocss/reset/tailwind.css"
import "virtual:uno.css"
```

Then add a `uno.config.ts` file to the root of the project with the following content:

```ts
import { defineConfig, presetTypography, presetUno } from "unocss"
import transformerDirectives from "@unocss/transformer-directives"

export default defineConfig({
  presets: [presetUno(), presetTypography()],
  transformers: [transformerDirectives()],
})
```

This configuration file is then read by the UnoCss plugin and used to generate the necessary CSS for our project. To enable that we also need to add the plugin to the Vite configuration in the `vite.config.ts` file:

```ts
import { fileURLToPath, URL } from "node:url"
import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import UnoCSS from "unocss/vite"

export default defineConfig({
  plugins: [Vue(), UnoCSS()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})
```

### Fixing the application state

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

```ts
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

This will remove the error message and give us a nice funky gradient header. All the classes used in the template are from **UnoCss**. It might look a bit weird and hard to read at first, but you will get used to it. The classes are very descriptive and easy to understand once you get the hang of it.

While we are at it, lets also add a nice radial gradient backdrop to the application. We can do this by adding some utility classes to our applications mount point. Replace the content of the `index.html` file with the following:

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

## Conclusion

![styling](/images/style.webp)

Now the application should be in a working state again. We have cleaned up the project and added some nice bling with UnoCss. In the next part of the tutorial we will start building the actual Kanban board.