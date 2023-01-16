<template>
  <div v-if="isLoaded">
    <div v-if="isLoggedIn">
      <!-- Check if email is verified -->
      <div
        v-if="verifyRegistrations && !emailIsVerified"
        class="container-xl px-4 mt-4"
      >
        <div>
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
              Please check your email. Check your spam folder too. You should
              receive it within 15 minutes.
            </p>
          </h4>
        </div>
      </div>
      <!-- Main content -->
      <div v-else>
        <header>
          <nav class="navbar navbar-default">
            <div class="navbar-header">
              <a class="navbar-brand" href="#"
                ><img
                  src="~~/iam/ui/img/nuxt-iam-logo-symbol.png"
                  style="width: 17%; display: inline"
                /><span style="color: #184b81">Nuxt<b>IAM</b></span></a
              >
              <button
                type="button"
                data-target="#navbarCollapse"
                data-toggle="collapse"
                class="navbar-toggle"
                @click="toggleShowMobileNav"
              >
                <span class="navbar-toggler-icon"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
            </div>
            <div
              id="navbarCollapse"
              class="navbar-collapse"
              :class="showMobileNav ? '' : 'collapse'"
            >
              <ul class="nav navbar-nav">
                <li class="active"><a href="#">Home</a></li>
                <li><a href="#">Admin</a></li>
              </ul>

              <ul class="nav navbar-nav navbar-right">
                <li :class="showProfileNav ? 'dropdown open' : ''">
                  <a
                    href="#"
                    data-toggle="dropdown"
                    class="dropdown-toggle user-action"
                    @click="toggleShowProfileNav"
                  >
                    <img
                      src="https://www.tutorialrepublic.com/examples/images/avatar/2.jpg"
                      class="avatar"
                      alt="Avatar" />
                    {{ profile.firstName }} {{ profile.lastName }}
                    <b class="caret"></b
                  ></a>
                  <ul class="dropdown-menu">
                    <li>
                      <a href="#"><i class="fa fa-user-o"></i> Profile</a>
                    </li>
                    <li>
                      <a href="#"><i class="fa fa-sliders"></i> Settings</a>
                    </li>
                    <li class="divider"></li>
                    <li>
                      <a href="#" @click="logMeOut">Logout</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>
        </header>

        <!-- Child component pages -->
        <div class="container">
          <div class="page-header">
            <h2>Dashboard</h2>
          </div>
          <h2>Hello {{ profile.firstName }},</h2>
          <p>This is your dashboard.</p>
        </div>
        <!-- End child pages -->
      </div>
    </div>
  </div>
  <div v-else class="container-xl px-4 mt-4">
    <div class="spinner-border" role="status"></div>
  </div>
</template>

<script setup>
// Get necessary functions from useIam composable
const {
  isAuthenticated,
  verifyEmail,
  getProfile,
  updateProfile,
  logout,
  deleteAccount,
} = useIam();

const showMobileNav = ref(false);
const showProfileNav = ref(false);
const router = useRouter();
const isLoaded = ref(false);
const iAmLoggedIn = ref(false);
const showProfile = ref(false);
let profileError = ref(null);
let updateSuccessful = ref(false);
let verificationEmailSent = ref(false);

// Check email verification
const verifyRegistrations =
  useRuntimeConfig().public.iamVerifyRegistrations === "true";
const emailIsVerified = ref(false);

/**
 * @desc Toggle showing mobile navigation
 */
function toggleShowMobileNav() {
  showMobileNav.value = !showMobileNav.value;
}

/**
 * @desc Toggle showing profile navigation
 */
function toggleShowProfileNav() {
  showProfileNav.value = !showProfileNav.value;
}

// User profile
const profile = {
  uuid: "",
  firstName: "",
  lastName: "",
  email: "",
  avatar: "",
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
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

    // Check email verification status
    emailIsVerified.value = data.email_verified;
    showProfile.value = true;
  }
}

// Attempt to update user profile
async function updateMyProfile(profile) {
  const { error } = await updateProfile(
    profile.uuid,
    profile.firstName,
    profile.lastName
  );

  // If error, display error
  if (error) {
    console.log("error: ", error);
    profileError.value = error;
    return;
  }

  updateSuccessful.value = true;
}

// Attempt to update user profile with password
async function updateMyProfileWithPassword(profile) {
  // Front end password validation
  if (
    !profile.currentPassword ||
    !profile.newPassword ||
    !profile.confirmNewPassword
  ) {
    const allPasswordsError = {
      message: "All passwords must be supplied",
    };
    console.log("error: ", allPasswordsError);
    profileError.value = allPasswordsError;
    return;
  }

  // Confirm password front end validation
  if (profile.newPassword !== profile.confirmNewPassword) {
    const confirmPasswordError = {
      message: "New password does not match confirm password",
    };
    console.log("error: ", confirmPasswordError);
    profileError.value = confirmPasswordError;
    return;
  }

  const { status, data, error } = await updateProfile(
    profile.uuid,
    profile.firstName,
    profile.lastName,
    profile.currentPassword,
    profile.newPassword,
    profile.confirmNewPassword
  );

  // If error, display error
  if (error) {
    console.log("error: ", error);
    profileError.value = error;
    return;
  }

  updateSuccessful.value = true;
}

// Attempt to delete user account
async function deleteMyAccount(profile) {
  const { status, error } = await deleteAccount(profile.uuid);

  // If error, show error
  if (error) {
    profileError.value = error;
    return;
  }

  // Otherwise, delete was successful, navigate to register
  const router = useRouter();
  router.push("/iam/register");
}

// Verify my email
async function verifyMyEmail(email) {
  verifyEmail(email);
  verificationEmailSent.value = true;
}

useHead({
  title: "Nuxt IAM Dashboard",
  link: {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css?family=Merienda+One",
    type: "text/css",
  },
  link: {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/icon?family=Material+Icons",
    type: "text/css",
  },
  link: {
    rel: "stylesheet",
    href: "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
    type: "text/css",
  },
  link: {
    rel: "stylesheet",
    href: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
    type: "text/css",
  },
});
</script>

<style scoped>
body {
  /* background: #eeeeee; */
  font-size: 150%;
}
.form-inline {
  display: inline-block;
}
.navbar {
  background: #fff;
  padding-left: 16px;
  padding-right: 16px;
  border-bottom: 1px solid #d6d6d6;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
}
.nav img {
  border-radius: 50%;
  width: 36px;
  height: 36px;
  margin: -8px 0;
  float: left;
  margin-right: 10px;
}
.navbar .navbar-brand {
  /* color: #555; */
  padding-left: 0;
  padding-right: 50px;
  font-family: "Merienda One", sans-serif;
}
.navbar .navbar-brand i {
  font-size: 20px;
  margin-right: 5px;
}
.search-box {
  position: relative;
}
.search-box input {
  box-shadow: none;
  padding-right: 35px;
  border-radius: 3px !important;
}
.search-box .input-group-addon {
  min-width: 35px;
  border: none;
  background: transparent;
  position: absolute;
  right: 0;
  z-index: 9;
  padding: 7px;
  height: 100%;
}
.navbar ul li i {
  font-size: 18px;
}
.navbar .dropdown-menu i {
  font-size: 16px;
  min-width: 22px;
}
.navbar .dropdown.open > a {
  background: none !important;
}
.navbar .dropdown-menu {
  border-radius: 1px;
  border-color: #e5e5e5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.navbar .dropdown-menu li a {
  /* color: #777; */
  padding: 8px 20px;
  line-height: normal;
}
.navbar .dropdown-menu li a:hover,
.navbar .dropdown-menu li a:active {
  color: #333;
}
.navbar .dropdown-menu .material-icons {
  font-size: 21px;
  line-height: 16px;
  vertical-align: middle;
  margin-top: -2px;
}
.navbar .badge {
  background: #f44336;
  font-size: 11px;
  border-radius: 20px;
  position: absolute;
  min-width: 10px;
  padding: 4px 6px 0;
  min-height: 18px;
  top: 5px;
}
.navbar ul.nav li a.notifications,
.navbar ul.nav li a.messages {
  position: relative;
  margin-right: 10px;
}
.navbar ul.nav li a.messages {
  margin-right: 20px;
}
.navbar a.notifications .badge {
  margin-left: -8px;
}
.navbar a.messages .badge {
  margin-left: -4px;
}
.navbar .active a,
.navbar .active a:hover,
.navbar .active a:focus {
  background: transparent !important;
}
@media (min-width: 1200px) {
  .form-inline .input-group {
    width: 300px;
    margin-left: 30px;
  }
}
@media (max-width: 1199px) {
  .form-inline {
    display: block;
    margin-bottom: 10px;
  }
  .input-group {
    width: 100%;
  }
}
</style>
