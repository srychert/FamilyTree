<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="sidebar">
    <div class="logo">
      <div class="profile">
        <span class="user">U</span>
      </div>
    </div>
    <nav>
      <RouterLink to="/" class="link">Home</RouterLink>
      <RouterLink to="/" class="link"
        >Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem
        consequuntur beatae quibusdam</RouterLink
      >
      <RouterLink to="/login" class="link login">LogIn</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.sidebar {
  height: 100vh;
  width: clamp(300px, 600px, 30%);
  border: 1px solid white;

  display: flex;
  flex-direction: column;
}

.logo {
  aspect-ratio: 16/9;
  background-color: white;
  display: grid;
  place-content: center;
}

.profile {
  width: 100px;
  aspect-ratio: 1/1;
  border: 1px solid black;
  border-radius: 50%;

  display: grid;
  place-content: center;
  font-size: xx-large;
  color: black;
}

nav {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.link {
  display: flex;
  align-items: center;
  color: var(--color-text);
  padding: 2em;
  border-bottom: 1px solid;
}
</style>
