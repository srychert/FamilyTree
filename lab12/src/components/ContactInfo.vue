<template>
  <li>
    <h2>{{ name }} <img class="friendIcon" src="friends.png" alt=""></h2>
    <button>Usuń/Dodaj ze/do znajomych</button>
    <button>Ukryj/Pokaż szczegóły</button>
    <ul>
      <li>
        <strong>telefon:</strong>
        {{ phoneNumber }}
      </li>
      <li>
        <strong>e-mail:</strong>
        {{ emailAddress }}
      </li>
    </ul>
  </li>
</template>

<script>
export default {
  props: ['name', 'phoneNumber', 'emailAddress', 'friend'],
  data() {
    return {
    };
  },
};
</script>

<style>
  .friendIcon {
    margin-left: 10px;
    width: 30px;
  }
</style>
