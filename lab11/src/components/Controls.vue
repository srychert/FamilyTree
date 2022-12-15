<template>
  <section id="controls">
    <Button msg="STARCIE" :handleClick="playerAttack"></Button>
    <Button msg="STARCIE++" :handleClick="playerAttackPlus" :disabled="!attackPlusAllowed"></Button>
    <Button msg="ODZYSKANIE SIŁ" :handleClick="playerHeal" :disabled="!healAllowed"></Button>
    <Button msg="KAPITULACJA" :handleClick="playerResign"></Button>
  </section>
</template>

<script>
import Button from "./Button.vue";

export default {
  name: "Controls",
  components: {
    Button,
  },
  props: {
    playerAttack: Function,
    playerAttackPlus: Function,
    playerHeal: Function,
    playerResign: Function,
    attackPlusAllowed: Boolean,
    healAllowed: Boolean,
  },
};
</script>
