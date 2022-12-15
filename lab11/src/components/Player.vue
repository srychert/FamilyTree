<template>
  <section :id="id" class="container">
    <h2>{{ name }}</h2>
    <div class="healthbar" style="background-color: red">
      <div
        class="healthbar__value"
        :style="{ width: playerBarWidth + '%' }"
      ></div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Player",
  props: {
    id: String,
    name: String,
    playerBarWidth: Number,
  },
};
</script>

<style>
section {
  width: 90%;
  max-width: 40rem;
  margin: auto;
}

.healthbar {
  width: 100%;
  height: 40px;
  border: 1px solid #575757;
  margin: 1rem 0;
  background: #d8d8d8;
}

.healthbar__value {
  background-color: #00a876;
  width: 100%;
  height: 100%;
}

.container {
  text-align: center;
  padding: 0.5rem;
  margin: 1rem auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  border-radius: 12px;
}

#opponent h2,
#player h2 {
  margin: 0.25rem;
}
</style>
