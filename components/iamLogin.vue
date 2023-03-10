<template>
  <div class="container">
    <main class="form-signin w-100 m-auto">      
      <form>
        <div style="margin-left: 64px">
        <NuxtLink to="/iam/"><img src="~~/iam/ui/img/nuxt-iam-logo.png/" style="width: 150px"/></NuxtLink>
      </div>
        <h1 class="h3 mb-3 fw-normal">Login</h1>
        <!-- Error message -->
        <div v-if="loginError" class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error: {{ loginError.message }}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" @click="loginError = null"></button>
        </div>
        <div v-if="allowGoogleAuth">
          <div class="form-group">
            <GoogleSignInButton
              @success="handleGoogleLoginSuccess"
              @error="handleGoogleLoginError"
            ></GoogleSignInButton>
          </div>
          <div class="or-seperator"><i>or</i></div>
        </div>
        <div class="form-floating">
          <input v-model="loginForm.email" type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
          <label for="floatingInput">Email address</label>
        </div>
        <div class="form-floating">
          <input v-model="loginForm.password" type="password" class="form-control" id="floatingPassword" placeholder="Password">
          <label for="floatingPassword">Password</label>
        </div>       
        <button class="w-100 btn btn-lg btn-primary" @click.prevent="tryLogin">Log in</button>        
        <div class="row my-2">
          <div class="col"><NuxtLink class="text-decoration-none" to="/iam/register">Register</NuxtLink></div>
          <div class="col"><NuxtLink class="text-decoration-none" to="/iam/reset">Forgot Password?</NuxtLink></div>          
        </div>       
      </form>      
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  GoogleSignInButton,
  type CredentialResponse,
} from "vue3-google-signin";

// Get necessary functions from useIam composable
const { login, loginWithGoogle } = useIam();
const allowGoogleAuth = useRuntimeConfig().public.iamAllowGoogleAuth === "true";

// These variables come from response from calling Nuxt IAM api
let loginError = ref(<{ message: "" } | null>null);

const loginForm = {
  email: "",
  password: "",
};

// Try to log user in
async function tryLogin() {
  const { status, error } = await login(loginForm.email, loginForm.password); 

  // If error, log error and return
  if (status === 'fail'){
    loginError.value = error
    console.error(error); 
    return
  }
  
  // If successful, navigate to dashboard
  if (status === "success") navigateTo("/iam/dashboard");
}

// Handle Google login success
const handleGoogleLoginSuccess = async (response: CredentialResponse) => {
  const { credential } = response;
  let res = null;
  if (credential) res = await loginWithGoogle(credential);

  // Check for error
  if (res?.error) {
    loginError.value = res.error;
  } else {
    navigateTo("/iam/dashboard");
  }
};

// Handle Google error event
const handleGoogleLoginError = () => {
  console.error("Login failed");
};

// If you're using the same version of Bootstrap in your whole app, you can remove the links and scripts below
useHead({
  title: "Nuxt IAM Login",  
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
.or-seperator {
  margin: 20px 0 10px;
  text-align: center;
  border-top: 1px solid #ccc;
  font-weight: bold;
}
.or-seperator i {
  padding: 0 10px;
  background: #f7f7f7;
  position: relative;
  top: -11px;
  z-index: 1;
}
</style>
