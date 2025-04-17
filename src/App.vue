<script setup lang="ts">
</script>

<template>
  <div class="max-w-sm mx-auto relative">
    <main class="bg-gray-900">
      <RouterView />
      <div class="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-sm w-full bg-gray-800 flex justify-around py-4 px-2 z-10">
        <RouterLink to="/" class="text-white text-xs font-bold">
          Home
        </RouterLink>
        <RouterLink to="/buypre" class="text-white text-xs font-bold">
          Buy Premium
        </RouterLink>
        <RouterLink to="/buystar" class="text-white text-xs font-bold">
          Buy Stars
        </RouterLink>
        <RouterLink to="/swapstar" class="text-white text-xs font-bold">
          Swap Star
        </RouterLink>
      </div>
    </main>
  </div>
</template>
