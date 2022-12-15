<template>
  <HelloWorld msg="Hello Vue!" />
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
};
</script>

<style>
#app {
  background-color: white;
}
</style>
