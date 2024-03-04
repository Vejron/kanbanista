# kanbanista

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

## What are we going to build

A simple Kanban:ish board application that allows users to create, read, update, and delete tasks. We will use the Vue 3 Composition API to manage the state of the application and to create reusable logic. We will also use the Vue Router to create a multi-page application and the Axios library to make HTTP requests to a REST API.

### App structure

The application will have three pages/views: Home, Board, and Task. The Home page will display a list of boards. The Board page will display a list of tasks for a specific board. The Task page will display the details of a specific task.

#### Home

The Home page will display a list of boards. Each board will have a title and a description. The user will be able to click on a board to navigate to the Board page. for this example, we will use a static list of boards to simplify things a bit.

#### Board

The Board page will display a list of tasks for a specific board. Each task will have a title, a description, and a status. The user will be able to click on a task to navigate to the Task page.

#### Task

The Task page will display the details of a specific task. The user will be able to update the title, description, and status of the task. The user will also be able to delete the task.

### Components

We will create a few components to help us build the pages. We will start with the pages/views which are just regular vue components that vue-router will use to render the different pages based on the current url. Then we will create a few more components to help us build the pages.

## Install additional dependencies

We will start with installing some additional dependencies that will be of use in this project. The VueUse library provides a collection of useful composition functions for Vue 3. Snarkdown is a simple and minimal markdown parser. Axios is a promise-based HTTP client for the browser and Node.js.

```sh
npm i @vueuse/core snarkdown axios
```

We will also install support for iconify icons.

```sh
npm install --save-dev @iconify/vue
```
