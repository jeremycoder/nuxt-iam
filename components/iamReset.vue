<template>
  <div class="container">
    <main class="form-signin w-100 m-auto">
      <div v-if="formSent === false">
        <form>
        <div style="margin-left: 64px">
          <NuxtLink to="/iam/"><img src="~~/iam/ui/img/nuxt-iam-logo.png/" style="width: 150px"/></NuxtLink>
        </div>          
        <h1 class="h3 mb-3 fw-normal">Password Reset</h1>
        <p>
          Enter your email address and we'll send you an email with
          instructions to reset your password.
        </p>       
        <div class="form-floating">
          <input v-model="resetForm.email" type="email" class="form-control" id="floatingEmail" placeholder="name@example.com">
          <label for="floatingEmail">Email address</label>
        </div>           
        <button class="w-100 btn btn-lg btn-primary" @click.prevent="resetMyPassword">Reset Password</button>
        <div class="row my-2">
          <div class="col"><NuxtLink class="text-decoration-none" to="/iam/register">Register</NuxtLink></div>
          <div class="col"><NuxtLink class="text-decoration-none" to="/iam/login">Login</NuxtLink></div>          
        </div>              
      </form>
      </div>
      <div v-else>
        <p>Please check your email for reset instructions. Check your spam folder too.</p>
      </div>            
    </main>
  </div>
</template>

<script setup>
const { resetPassword } = useIam();
const formSent = ref(false);

const resetForm = {
  email: "",
};


async function resetMyPassword() {
  // If nothing is in form, just return without sending anything to server
  if (resetForm.email.length === 0) return;

  // For security purposes, this always returns successful
  // Check your server console logs for debugging purposes
  const result = await resetPassword(resetForm.email);
  console.log("reset form: ", result);
  formSent.value = true;
}

useHead({
  title: "Nuxt IAM Register", 
});
</script>

<style scoped>
.form-signin {
  max-width: 330px;
  padding: 15px;
}

.form-signin .form-floating:focus-within {
  z-index: 2;
}

.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.or-seperator i {
  padding: 0 10px;
  background: #f7f7f7;
  position: relative;
  top: -11px;
  z-index: 1;
}
</style>
