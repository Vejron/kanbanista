# Part 1 - Setup

This tutorial is a step-by-step, copy & paste, guide to building a Vue 3 kanban™ application from scratch. It's designed to be beginner-friendly and assumes no prior knowledge of **Vue** but some familiarity with **JavaScript** and web development in general is recommended.

## Prerequisites

Before we start, make sure you have the following tools installed on your machine:

- [Node.js](https://nodejs.org/) (~18)
- Editor (VS Code, Sublime Text, Atom, etc.)
- Browser (Chrome, Firefox, Safari, etc.)
- Git *(only needed for the last step)*

For the best experience, Please use [Visual Studio Code](https://code.visualstudio.com/) as your editor as it has the best support for Vue development. It has several extensions that make working with Vue projects a lot smoother. For this tutorial, I recommend the following extensions:

- [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Iconify IntelliSense](https://marketplace.visualstudio.com/items?itemName=antfu.iconify)
- [UnoCSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=antfu.unocss)

## Project Setup

Now that you have all the necessary tools installed, let's create a new Vue 3 project. Open your terminal of choice and run the following command:

```sh
npm create vue@latest
```

This command will install and execute create-vue, the official Vue project scaffolding tool. You will be presented with prompts for several optional features such as TypeScript and testing support. For this tutorial, answer yes to **TypeScript**, **Vue Router**, **ESLint and prettier**.

## Project Dependencies

Once the project is created, navigate to the project directory and run the following commands to install the necessary dependencies:

```sh
npm i @vueuse/core mqtt snarkdown @formkit/drag-and-drop
```

```sh
npm i --save-dev unocss @iconify/vue
```

This will install the excellent [VueUse](https://vueuse.org/) library (which is almost akin to a standard lib for Vue), the MQTT client library, Snarkdown (a minimal markdown renderer) and a library to help with drag-and-drop stuff.

It also installs development support for [iconify icons](https://iconify.design/) and UnoCss, an atomic CSS framework that generates only the CSS you need.

## Project Structure

Open the project in your editor and take a look at the project structure. Vue does'nt enforce a specific project structure, but the default structure created by the scaffolding tool is how most **Vue projects** are structured. Starting from the top level, you will see the following directories and files:

- `dist`: Contains the compiled output of the project.
- `node_modules`: Project dependencies.
- `public`: Static assets for the project. This is where you would put images, fonts, and other files that don't need to be processed and will be served as-is.
- `src`: Contains the source code and any assets that need to be processed in any way.
  - `src/components`: By convention, this is where you would put your Vue components.
  - `src/assets`: Assets that need to be processed in any way, such as stylesheets and images.
  - `src/App.vue`: The root component of the application.
  - `src/main.ts`: The entry point of the application.
- `index.html`: The main HTML file of the application.
- `package.json`: Project metadata and dependencies.
- `vite.config.ts`: Configuration for the Vite build tool.

## A note on Vue SFCs

Vue components can be written in several ways, but by far the most common way is to use **Single File Components** (SFCs). Other possible ways include JSX and just using the raw Vue API. For this tutorial, we will be using SFCs to define components. An SFC is a file that contains a template, script, and style block for a single component. The template block contains the HTML markup, the script block contains the logic, and the style block contains styles for the component.

Even when using SFCs, there are several ways to write components. For this tutorial, we will be using the Composition API, which is the recommended way to write components in Vue 3. The Composition API allows you to write components in a more modular and flexible way than the older the Options API, which was the standard way to define components in Vue 2.

## Compile and Hot-Reload for Development

Now you can run the following command to start the development server:

```sh
npm run dev
```

Open your browser and navigate to `http://localhost:5173` where you will be greeted with the default Vue 3 welcome page.

Try changing the content of the `HelloWorld.vue` component in the `src/components` directory and see the changes reflected in the browser. This is hot-reloading in action, a feature that automatically updates the browser when you make changes to your code. It's not perfect, but when it works it's a big time-saver.
