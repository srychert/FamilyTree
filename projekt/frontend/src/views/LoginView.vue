<script setup>
import axios, { isCancel, AxiosError } from "axios";
import { ref } from "vue";
import api from "../api";

const login = ref("");
const password = ref("");

const handelLogin = () => {
  api()
    .post("login", {
      login: login.value,
      password: password.value,
    })
    .then((r) => console.log(r))
    .catch((err) => console.error(err));
};
</script>

<template>
  <h1>LogIn</h1>
  <form>
    <div class="form-row">
      <label for="login">Login</label>
      <input id="login" type="text" v-model="login" />
    </div>

    <div class="form-row">
      <label for="password">Password</label>
      <input id="password" type="password" v-model="password" />
    </div>

    <input type="button" value="Login" @click="handelLogin" />
  </form>
</template>

<style scoped>
.form-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
