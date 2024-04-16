# Vue 3 Tutorial Part 1: Setup

This tutorial is a step-by-step guide to building a Vue 3 kanban application from scratch. The tutorial is designed to be beginner-friendly and assumes no prior knowledge of Vue or web development.

## Project Setup

```sh
npm create vue@latest
```

This command will install and execute create-vue, the official Vue project scaffolding tool. You will be presented with prompts for several optional features such as TypeScript and testing support. For this tutorial, answer yes to TypeScript, Vue Router, ESLint and prettier.

## Project Dependencies

Once the project is created, navigate to the project directory and run the following commands to install the necessary dependencies:

```sh
npm i @vueuse/core mqtt snarkdown @formkit/drag-and-drop
```

```sh
npm i --save-dev unocss @iconify/vue
```

This will install the excellent VueUse library (which is almost akin to a standard lib for Vue), the MQTT client library, Snarkdown (a markdown parser) and a library to help with drag-and-drop stuff.

It also installs support for iconify icons and UnoCss. You can find a list of available icons at [iconify.design](https://iconify.design/).

### Compile and Hot-Reload for Development

Now you can run the following command to start the development server:

```sh
npm run dev
```

Open your browser and navigate to `http://localhost:5173` to see the default Vue 3 Welcome app running.

Try changing the content of the `HelloWorld.vue` component in the `src/components` directory and see the changes reflected in the browser. This is hot-reloading in action, a feature that automatically updates the browser when you make changes to your code. It's not perfect, but when it works it's a big time-saver.
