<script setup lang="ts">
import Setup from '@/tutorial/setup.md'
import Part2 from '@/tutorial/part-2.md'
import Part3 from '@/tutorial/part-3.md'
import Part4 from '@/tutorial/part-4-crud.md'
import Part5 from '@/tutorial/part-5-persistance.md'
</script>

<template>
  <section class="w-full flex justify-center px-4">
    
    <div class="prose prose-light text-base !max-w-[80ch]">
      <nav>
        <ul class="flex gap-4 list-none max-w-[80ch] not-prose">
          <li>
            <router-link class="link" to="/about">Setup</router-link>
          </li>
          <li>
            <router-link class="link" to="/about/part-2">Part 2</router-link>
          </li>
          <li>
            <router-link class="link" to="/about/part-3">Part 3</router-link>
          </li>
          <li>
            <router-link class="link" to="/about/part-4">Part 4</router-link>
          </li>
          <li>
            <router-link class="link" to="/about/part-5">Part 5</router-link>
          </li>
          <li>
            <router-link class="link" to="/about/part-6">Part 6</router-link>
          </li>
        </ul>
      </nav>
      <router-view v-slot="{ Component }">
        <transition mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
      <nav>
        <ul class="flex gap-4 list-none max-w-[80ch] not-prose">
          <li>
            <router-link class="link" to="/about">Setup</router-link>
          </li>
          <li>
            <router-link class="link" to="/about/part-2">Part 2</router-link>
          </li>
          <li>
            <router-link class="link" to="/about/part-3">Part 3</router-link>
          </li>
          <li>
            <router-link class="link" to="/about/part-4">Part 4</router-link>
          </li>
          <li>
            <router-link class="link" to="/about/part-5">Part 5</router-link>
          </li>
          <li>
            <router-link class="link" to="/about/part-6">Part 6</router-link>
          </li>
        </ul>
      </nav>
    </div>

  </section>
</template>

<style scoped>
.link {
  @apply text-purple-400 hover:text-yellow-500 transition-all;
}

.router-link-exact-active {
  @apply text-orange-500 font-bold;
}

</style>
