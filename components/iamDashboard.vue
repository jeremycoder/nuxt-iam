<template>
  <div v-if="isLoaded">
    <div v-if="isLoggedIn">
      <!-- Check if email is verified -->
      <div
        v-if="verifyRegistrations && !emailIsVerified"
        class="container-xl px-4 mt-4"
      >
        <div class="container">
          <h2>Email verification is required</h2>
          <h4 v-if="!verificationEmailSent">
            <p>Please click the button below to verify your email</p>
            <button
              class="btn btn-primary"
              type="button"
              @click="verifyMyEmail(profile.email)"
            >
              Send email verification
            </button>
          </h4>
          <h4 v-else>
            <p>
              Please check your email. Check your spam folder too. Click the
              link in the email to verify your email. You should receive it
              within 15 minutes.
            </p>
          </h4>
        </div>
      </div>
      <div v-if="profile && profile.isActive === false" class="container my-5">
        <div class="alert alert-danger" role="alert">
          <h3 class="alert-heading">Account is not active!</h3>
          <p>
            Your account has been deactivated, and you cannot access it. Please
            contact an administrator to restore it.
          </p>
          <hr />
          <button type="button" class="btn btn-secondary" @click="logMeOut">
            Log out
          </button>
        </div>
      </div>
      <div v-else>
        <header>
          <nav
            class="navbar bg-body-tertiary bg-white fixed-top p-3 mb-3 border-bottom border-{#FF0}"
          >
            <div class="container-fluid">
              <NuxtLink class="navbar-brand" to="/iam/dashboard"
                ><img
                  src="~~/iam/ui/img/nuxt-iam-logo-symbol.png"
                  style="width: 17%; display: inline"
                /><span style="color: #184b81">Nuxt<b>IAM</b></span></NuxtLink
              >
              <!-- Profile icon -->
              <div v-if="profile" class="dropdown text-end">
                <a
                  href="#"
                  class="d-block link-dark text-decoration-none dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span v-if="profile.avatar">
                    <img
                      :src="profile.avatar"
                      alt="mdo"
                      width="32"
                      height="32"
                      class="rounded-circle"
                    />
                  </span>
                  <span v-else>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      fill="currentColor"
                      class="bi bi-person-circle"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                      <path
                        fill-rule="evenodd"
                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                      />
                    </svg>
                  </span>

                  <span class="mx-1 profile-name"
                    >{{ firstName }} {{ lastName }}</span
                  >
                </a>
                <ul class="dropdown-menu text-small">
                  <li>
                    <NuxtLink class="dropdown-item" to="/iam/dashboard/profile"
                      >Profile</NuxtLink
                    >
                  </li>
                  <li>
                    <NuxtLink class="dropdown-item" to="/iam/dashboard/settings"
                      >Settings</NuxtLink
                    >
                  </li>
                  <li><hr class="dropdown-divider" /></li>
                  <li>
                    <a class="dropdown-item" href="#" @click="logMeOut"
                      >Logout</a
                    >
                  </li>
                </ul>
              </div>

              <!-- Menu toggler -->
              <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasNavbar"
                aria-controls="offcanvasNavbar"
              >
                <span class="navbar-toggler-icon"></span>
              </button>

              <div
                class="offcanvas offcanvas-end"
                tabindex="-1"
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
              >
                <div class="offcanvas-header">
                  <h5 class="offcanvas-title" id="offcanvasNavbarLabel">
                    Menu
                  </h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="offcanvas-body">
                  <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                    <li class="nav-item">
                      <NuxtLink class="nav-link active" to="/iam/dashboard/"
                        >Home</NuxtLink
                      >
                    </li>
                    <li
                      v-if="
                        profile.permissions &&
                        profile.permissions.includes('canAccessAdmin')
                      "
                      class="nav-item"
                    >
                      <NuxtLink class="nav-link" to="/iam/dashboard/admin"
                        >Admin</NuxtLink
                      >
                    </li>
                    <li class="nav-item dropdown">
                      <a
                        class="nav-link dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Sample Dropdown
                      </a>
                      <ul
                        class="dropdown-menu gap-1 p-2 rounded-3 mx-0 shadow w-220px"
                      >
                        <li>
                          <a class="dropdown-item rounded-2 active" href="#"
                            >Action</a
                          >
                        </li>
                        <li>
                          <a class="dropdown-item rounded-2" href="#"
                            >Another action</a
                          >
                        </li>
                        <li>
                          <a class="dropdown-item rounded-2" href="#"
                            >Something else here</a
                          >
                        </li>
                        <li><hr class="dropdown-divider" /></li>
                        <li>
                          <a class="dropdown-item rounded-2" href="#"
                            >Separated link</a
                          >
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </nav>
        </header>
        <!-- Main content -->
        <main style="margin-top: 86px">
          <div class="container">
            <!-- Some child pages need profile data and some don't -->
            <NuxtPage :profile="profile" @profileUpdate="getMyProfile" />
          </div>
        </main>
      </div>
    </div>
  </div>
  <div v-else class="container-xl px-4 mt-4">
    <div class="spinner-border" role="status"></div>
  </div>
</template>

<script setup>
const { isAuthenticated, getProfile, logout, verifyEmail } = useIam();

const router = useRouter();
const isLoaded = ref(false);
const iAmLoggedIn = ref(false);
const showProfile = ref(false);
let profileError = ref(null);

let verificationEmailSent = ref(false);

// Profile variables
const firstName = ref("");
const lastName = ref("");

// Check email verification
const verifyRegistrations =
  useRuntimeConfig().public.iamVerifyRegistrations === "true";
const emailIsVerified = ref(false);

// User profile
const profile = {
  uuid: "",
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  avatar: "",
  isActive: "",
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
  permissions: "",
};

onMounted(async () => {
  await isLoggedIn();
  await getMyProfile();
  isLoaded.value = true;
});

async function isLoggedIn() {
  iAmLoggedIn.value = await isAuthenticated();

  // If user is not authenticated, push to login page
  if (!iAmLoggedIn.value) router.push("/iam/login");
}

// Log user out
async function logMeOut() {
  const { status } = await logout();
  if (status === "success") {
    router.push("/iam/login");
  }
}

// Attempt to get user profile
async function getMyProfile() {
  const { status, error, data } = await getProfile();

  // If error, show error
  if (error) {
    console.log("error: ", error);
    profileError.value = error;
  }

  // If successful, data will contain profile
  if (status === "success") {
    profile.uuid = data.uuid;
    profile.firstName = data.first_name;
    profile.lastName = data.last_name;
    profile.email = data.email;
    profile.avatar = data.avatar;
    profile.isActive = data.is_active;
    profile.role = data.role;
    profile.permissions = data.permissions;

    console.log("profile: ", profile);

    // Assign to local reactive variables
    firstName.value = profile.firstName;
    lastName.value = profile.lastName;

    // Check email verification status
    emailIsVerified.value = data.email_verified;
    showProfile.value = true;
  }
}

/**
 * @desc Sends API request to verify email
 * @param email User email
 */
async function verifyMyEmail(email) {
  console.log("Verifying my email: ", email);
  verifyEmail(email);
  verificationEmailSent.value = true;
}

useHead({
  title: "Nuxt IAM Dashboard",
  link: {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css",
    type: "text/css",
  },
  script: {
    src: "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js",
  },
});
</script>

<style scoped>
@media only screen and (max-width: 515px) {
  .profile-name {
    display: none;
  }
}
</style>
