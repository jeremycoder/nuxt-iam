<template>
  <header>
    <nav class="navbar navbar-default">
      <div class="navbar-header">
        <a class="navbar-brand" href="#"
          ><i class="fa fa-cube"></i
          ><span style="color: #184b81">Nuxt<b>IAM</b></span></a
        >
        <button
          type="button"
          data-target="#navbarCollapse"
          data-toggle="collapse"
          class="navbar-toggle"
        >
          <span class="navbar-toggler-icon"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
      </div>
      <!-- Collection of nav links, forms, and other content for toggling -->
      <div id="navbarCollapse" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li class="active"><a href="#">Home</a></li>
          <li><a href="#">Admin</a></li>
        </ul>

        <ul class="nav navbar-nav navbar-right">
          <li :class="showProfileNav ? 'dropdown open' : ''">
            <!-- add open to toggle open -->
            <a
              href="#"
              data-toggle="dropdown"
              class="dropdown-toggle user-action"
              :aria-expanded="showProfileNav ? true : false"
              @click="toggleShowProfileNav"
            >
              <!-- change to true to open menu, then false to close menu
             -->
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

  <div class="container">
    <div class="table-wrapper">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Address</th>
            <th>City</th>
            <th>Pin Code</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Thomas Hardy</td>
            <td>89 Chiaroscuro Rd.</td>
            <td>Portland</td>
            <td>97219</td>
            <td>USA</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Maria Anders</td>
            <td>Obere Str. 57</td>
            <td>Berlin</td>
            <td>12209</td>
            <td>Germany</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Fran Wilson</td>
            <td>C/ Araquil, 67</td>
            <td>Madrid</td>
            <td>28023</td>
            <td>Spain</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Dominique Perrier</td>
            <td>25, rue Lauriston</td>
            <td>Paris</td>
            <td>75016</td>
            <td>France</td>
          </tr>
          <tr>
            <td>5</td>
            <td>Martin Blank</td>
            <td>Via Monte Bianco 34</td>
            <td>Turin</td>
            <td>10100</td>
            <td>Italy</td>
          </tr>
        </tbody>
      </table>
      <div class="text-center">
        <ul class="pagination justify-content-center">
          <li class="page-item disabled">
            <a href="#"><i class="fa fa-long-arrow-left"></i> Previous</a>
          </li>
          <li class="page-item"><a href="#" class="page-link">1</a></li>
          <li class="page-item"><a href="#" class="page-link">2</a></li>
          <li class="page-item active"><a href="#" class="page-link">3</a></li>
          <li class="page-item"><a href="#" class="page-link">4</a></li>
          <li class="page-item"><a href="#" class="page-link">5</a></li>
          <li class="page-item">
            <a href="#" class="page-link"
              >Next <i class="fa fa-long-arrow-right"></i
            ></a>
          </li>
        </ul>
      </div>
    </div>
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
  console.log("show profile nav: ", showProfileNav.value);
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
  console.log("isLoggedIn: ", iAmLoggedIn.value);

  // If user is not authenticated, push to login page
  if (!iAmLoggedIn.value) router.push("/iam/login");
}

// Log user out
async function logMeOut() {
  const { status } = await logout();
  console.log("status: ", status);
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
    console.log("status: ", status);
    console.log("data: ", data);
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
  console.log("profile: ", profile);
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

  console.log("status: ", status);
  console.log("data: ", data);
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
  console.log("Verifying my email: ", email);
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
  script: {
    src: "https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js",
  },
  script: {
    src: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js",
  },
});
</script>

<style>
/* body {
  background: #eeeeee;
} */
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
