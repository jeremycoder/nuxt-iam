<template>
  <div class="login-container">
    <form class="login-form">
      <label for="email">Email:</label>
      <input type="email" id="email" v-model="loginForm.email" required />

      <label for="password">Password:</label>
      <input
        type="password"
        id="password"
        v-model="loginForm.password"
        required
      />

      <label for="confirm-password">Confirm Password:</label>
      <input
        type="password"
        id="confirm-password"
        v-model="loginForm.confirmPassword"
        required
      />

      <button type="submit" @click.prevent="login">Login</button>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #2196f3;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

label {
  font-size: 16px;
  margin-bottom: 8px;
}

input {
  width: 300px;
  height: 32px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  font-size: 16px;
}

button {
  width: 120px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  font-size: 16px;
  cursor: pointer;
}
</style>

<script setup>
const { login, isAuthenticated } = useIam();

const isLoggedIn = await isAuthenticated();

const loginForm = {
  email: "",
  password: "",
  confirmPassword: "",
};
</script>
