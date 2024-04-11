<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="flex justify-center">
    <h1 class="text-6xl tracking-tight font-bold my-4 bg-gradient-to-r from-purple-600 via-orange-500 to-purple-600 text-transparent bg-clip-text">
      Kanbanista
    </h1>
    
  </header>
  <div class="w-full bg-gradient-to-r from-purple-900 via-orange-500 to-purple-900 h-1 mb-6"></div>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

main {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
