<template>
  <div v-if="isLoaded">
    <div v-if="isLoggedIn">
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
      <div v-else class="container-xl px-4 mt-4">
        <!-- Profile errors notification -->
        <div
          v-if="profileError"
          class="alert alert-danger alert-dismissable"
          role="alert"
        >
          <button
            @click="profileError = null"
            type="button"
            class="close"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span></button
          >{{ profileError.message }}
        </div>
        <!-- Profile success notification -->
        <div
          v-if="updateSuccessful"
          class="alert alert-success alert-dismissable"
          role="alert"
        >
          <button
            @click="updateSuccessful = false"
            type="button"
            class="close"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span></button
          >Profile updated successfully
        </div>
        <!-- profile button -->
        <div class="row no-gutters row-bordered row-border-light">
          <div class="col-md-3">
            <div class="flex-shrink-0 p-3 bg-white" style="width: 280px">
              <a
                href="/"
                class="d-flex align-items-center pb-3 mb-3 link-dark text-decoration-none border-bottom"
              >
                <svg class="bi me-2" width="30" height="24">
                  <use xlink:href="#bootstrap" />
                </svg>
                <span class="fs-5 fw-semibold">Collapsible</span>
              </a>
              <ul class="list-unstyled ps-0">
                <li class="mb-1">
                  <button
                    class="btn btn-toggle align-items-center rounded collapsed"
                    data-bs-toggle="collapse"
                    data-bs-target="#home-collapse"
                    aria-expanded="true"
                  >
                    Home
                  </button>
                  <div class="collapse show" id="home-collapse">
                    <ul
                      class="btn-toggle-nav list-unstyled fw-normal pb-1 small"
                    >
                      <li>
                        <a href="#" class="link-dark rounded">Overview</a>
                      </li>
                      <li><a href="#" class="link-dark rounded">Updates</a></li>
                      <li><a href="#" class="link-dark rounded">Reports</a></li>
                    </ul>
                  </div>
                </li>
                <li class="mb-1">
                  <button
                    class="btn btn-toggle align-items-center rounded collapsed"
                    data-bs-toggle="collapse"
                    data-bs-target="#dashboard-collapse"
                    aria-expanded="false"
                  >
                    Dashboard
                  </button>
                  <div class="collapse" id="dashboard-collapse">
                    <ul
                      class="btn-toggle-nav list-unstyled fw-normal pb-1 small"
                    >
                      <li>
                        <a href="#" class="link-dark rounded">Overview</a>
                      </li>
                      <li><a href="#" class="link-dark rounded">Weekly</a></li>
                      <li><a href="#" class="link-dark rounded">Monthly</a></li>
                      <li>
                        <a href="#" class="link-dark rounded">Annually</a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li class="mb-1">
                  <button
                    class="btn btn-toggle align-items-center rounded collapsed"
                    data-bs-toggle="collapse"
                    data-bs-target="#orders-collapse"
                    aria-expanded="false"
                  >
                    Orders
                  </button>
                  <div class="collapse" id="orders-collapse">
                    <ul
                      class="btn-toggle-nav list-unstyled fw-normal pb-1 small"
                    >
                      <li><a href="#" class="link-dark rounded">New</a></li>
                      <li>
                        <a href="#" class="link-dark rounded">Processed</a>
                      </li>
                      <li><a href="#" class="link-dark rounded">Shipped</a></li>
                      <li>
                        <a href="#" class="link-dark rounded">Returned</a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li class="border-top my-3"></li>
                <li class="mb-1">
                  <button
                    class="btn btn-toggle align-items-center rounded collapsed"
                    data-bs-toggle="collapse"
                    data-bs-target="#account-collapse"
                    aria-expanded="false"
                  >
                    Account
                  </button>
                  <div class="collapse" id="account-collapse">
                    <ul
                      class="btn-toggle-nav list-unstyled fw-normal pb-1 small"
                    >
                      <li><a href="#" class="link-dark rounded">New...</a></li>
                      <li><a href="#" class="link-dark rounded">Profile</a></li>
                      <li>
                        <a href="#" class="link-dark rounded">Settings</a>
                      </li>
                      <li>
                        <a href="#" class="link-dark rounded">Sign out</a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-md-9">
            <div class="row">
              <div class="col-xl-10">
                <h1>Profile</h1>
              </div>
              <div class="col-xl-1">
                <button
                  type="button"
                  class="btn btn-outline-primary mb-3"
                  @click="getMyProfile"
                >
                  Profile
                </button>
              </div>
              <div class="col-xl-1">
                <button
                  type="button"
                  class="btn btn-outline-secondary mb-3"
                  @click="logMeOut"
                >
                  Logout
                </button>
              </div>
            </div>
            <hr class="mt-0 mb-4" />
            <div v-if="showProfile" class="row">
              <div class="col-xl-8">
                <!-- Account details card-->
                <div class="card mb-4">
                  <div class="card-header">Account Details</div>
                  <div class="card-body">
                    <form>
                      <!-- Form Row-->
                      <div class="row gx-3 mb-3">
                        <!-- Form Group (first name)-->
                        <div class="col-md-6">
                          <label class="medium mb-1" for="inputFirstName"
                            >First name</label
                          >
                          <input
                            v-model="profile.firstName"
                            class="form-control"
                            id="inputFirstName"
                            type="text"
                            placeholder="Enter your first name"
                          />
                        </div>
                        <!-- Form Group (last name)-->
                        <div class="col-md-6">
                          <label class="medium mb-1" for="inputLastName"
                            >Last name</label
                          >
                          <input
                            v-model="profile.lastName"
                            class="form-control"
                            id="inputLastName"
                            type="text"
                            placeholder="Enter your last name"
                          />
                        </div>
                      </div>
                      <!-- Form Group (email address)-->
                      <div class="mb-3">
                        <label class="medium mb-1" for="inputEmailAddress"
                          >Email address</label
                        >
                        <input
                          class="form-control bg-light"
                          id="inputEmailAddress"
                          type="email"
                          :value="profile.email"
                          aria-label="Disabled input example"
                          disabled
                          readonly
                        />
                      </div>
                      <!-- Save changes button-->
                      <button
                        class="btn btn-primary"
                        type="button"
                        @click="updateMyProfile(profile)"
                      >
                        Save changes
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <hr class="mt-0 mb-4" />
            <div v-if="showProfile" class="row">
              <div class="col-lg-8">
                <!-- Change password card-->
                <div class="card mb-4">
                  <div class="card-header">Change Password</div>
                  <div class="card-body">
                    <form>
                      <!-- Form Group (current password)-->
                      <div class="mb-3">
                        <label class="medium mb-1" for="currentPassword"
                          >Current Password</label
                        >
                        <input
                          v-model="profile.currentPassword"
                          class="form-control"
                          id="currentPassword"
                          type="password"
                          placeholder="Enter current password"
                        />
                      </div>
                      <!-- Form Group (new password)-->
                      <div class="mb-3">
                        <label class="medium mb-1" for="newPassword"
                          >New Password</label
                        >
                        <input
                          v-model="profile.newPassword"
                          class="form-control"
                          id="newPassword"
                          type="password"
                          placeholder="Enter new password"
                        />
                      </div>
                      <!-- Form Group (confirm password)-->
                      <div class="mb-3">
                        <label class="medium mb-1" for="confirmPassword"
                          >Confirm Password</label
                        >
                        <input
                          v-model="profile.confirmNewPassword"
                          class="form-control"
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <button
                        class="btn btn-primary"
                        type="button"
                        @click="updateMyProfileWithPassword(profile)"
                      >
                        Update password
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <div class="col-lg-4">
                <!-- Delete account card-->
                <div class="card mb-4">
                  <div class="card-header">Delete Account</div>
                  <div class="card-body">
                    <p>
                      Deleting your account is a permanent action and cannot be
                      undone. If you are sure you want to delete your account,
                      select the button below.
                    </p>
                    <button
                      class="btn btn-danger"
                      type="button"
                      @click="deleteMyAccount(profile)"
                    >
                      I understand, delete my account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else><h1>Log in required</h1></div>
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

// User profile
const profile = {
  uuid: "",
  firstName: "",
  lastName: "",
  email: "",
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

// If you're using the same version of Bootstrap in your whole app, you can remove the links and scripts below
useHead({
  title: "Nuxt IAM Profile Example",
  script: {
    src: "https://code.jquery.com/jquery-1.10.2.min.js",
  },
  link: {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/bootstrap@4.5.0/dist/css/bootstrap.min.css",
    type: "text/css",
  },
  script: {
    src: "https://cdn.jsdelivr.net/npm/bootstrap@4.5.0/dist/js/bootstrap.bundle.min.js",
  },
});
</script>

<style scoped>
body {
  margin-top: 20px;
  background-color: #f2f6fc;
  color: #69707a;
}
.img-account-profile {
  height: 10rem;
}
.rounded-circle {
  border-radius: 50% !important;
}
.card {
  box-shadow: 0 0.15rem 1.75rem 0 rgb(33 40 50 / 15%);
}
.card .card-header {
  font-weight: 500;
}
.card-header:first-child {
  border-radius: 0.35rem 0.35rem 0 0;
}
.card-header {
  padding: 1rem 1.35rem;
  margin-bottom: 0;
  background-color: rgba(33, 40, 50, 0.03);
  border-bottom: 1px solid rgba(33, 40, 50, 0.125);
}
.form-control,
.dataTable-input {
  display: block;
  width: 100%;
  padding: 0.875rem 1.125rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1;
  color: #69707a;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #c5ccd6;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0.35rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.nav-borders .nav-link.active {
  color: #0061f2;
  border-bottom-color: #0061f2;
}
.nav-borders .nav-link {
  color: #69707a;
  border-bottom-width: 0.125rem;
  border-bottom-style: solid;
  border-bottom-color: transparent;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0;
  padding-right: 0;
  margin-left: 1rem;
  margin-right: 1rem;
}
</style>
