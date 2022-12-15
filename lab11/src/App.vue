<template>
  <Header></Header>
  <Game></Game>
</template>

<script>
import Game from "./components/Game.vue";
import Header from "./components/Header.vue";

export default {
  name: "App",
  components: {
    Header,
    Game,
  },
};
</script>

<style>
#app {
  background-color: white;
}
</style>
