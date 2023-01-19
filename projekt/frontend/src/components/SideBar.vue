<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="sidebar">
    <div class="logo"></div>
    <div class="wrapper">
      <nav>
        <RouterLink to="/" class="link">Home</RouterLink>
        <RouterLink to="/" class="link">Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem consequuntur beatae quibusdam</RouterLink>
      </nav>
    </div>

  </div>
</template>

<style scoped>
.sidebar {
    height: 100vh;
    width: clamp(300px, 600px, 40%);

    border: 1px solid white;
}

.logo {
    height: 300px;
    background-color: white;
}

.link {
    display: flex;
    align-items: center;
    color: var(--color-text);
    padding: 2em;
    border-bottom: 1px solid;
}
</style>