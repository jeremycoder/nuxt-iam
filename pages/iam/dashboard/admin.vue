<template>
  <!-- Look for permission attribute 'canAccessAdmin' -->
  <div
    v-if="
      $attrs.profile.permissions &&
      $attrs.profile.permissions.includes('canAccessAdmin')
    "
  >
    <div>
      <h1 class="mt-5">Admin</h1>
      <p class="lead">This is your admin center.</p>
    </div>
    <!-- Users table edit Modal -->
    <div
      class="modal fade"
      id="usersTableModal"
      tabindex="-1"
      aria-labelledby="usersTableModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="usersTableModalLabel">
              Edit user
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <!-- Users table edit error -->
          <div
            v-if="usersTableError"
            class="alert alert-danger alert-dismissible fade show m-2"
            role="alert"
          >
            <strong>{{ usersTableError.message }}</strong>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
              @click="usersTableError = null"
            ></button>
          </div>

          <!-- Edit user success notification -->
          <div
            v-if="editUserSuccessful"
            class="alert alert-success alert-dismissible fade show m-2"
            role="alert"
          >
            <strong>User updated successfully</strong>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
              @click="editUserSuccessful = false"
            ></button>
          </div>

          <!-- Edit modal body  -->
          <div class="modal-body">
            <form v-if="userTableRecord">
              <div class="mb-3">
                <label for="text" class="form-label"
                  ><strong>Uuid</strong></label
                >
                <input
                  type="text"
                  class="form-control mb-3"
                  id="uuid"
                  style="width: 300px"
                  :value="userTableRecord.uuid"
                  disabled
                />
                <label for="email" class="form-label"
                  ><strong>Email address</strong></label
                >
                <input
                  type="email"
                  class="form-control mb-3"
                  id="email"
                  style="width: 300px"
                  :value="userTableRecord.email"
                  disabled
                />
                <label for="email_verified" class="form-label"
                  ><strong>Email verified</strong></label
                >
                <input
                  type="email"
                  class="form-control mb-3"
                  id="email_verified"
                  style="width: 300px"
                  :value="userTableRecord.email_verified"
                  disabled
                />
                <label for="role" class="form-label"
                  ><strong>Role</strong></label
                >
                <p>Current role: {{ userTableRecord.role }}</p>
                <p>
                  New role: <span>{{ selectedRole }}</span>
                </p>
                <select
                  class="form-select form-control mb-3"
                  id="role"
                  aria-label="Role select"
                  style="width: 300px"
                  v-model="selectedRole"
                >
                  <option>SUPER_ADMIN</option>
                  <option>ADMIN</option>
                  <option>GENERAL</option>
                </select>

                <label for="is_active" class="form-label"
                  ><strong>Is Active</strong></label
                >
                <select
                  class="form-select form-control mb-3"
                  id="is_active"
                  aria-label="Role select"
                  style="width: 300px"
                  v-model="userTableData.isActive"
                >
                  <option>true</option>
                  <option>false</option>
                </select>

                <label for="first_name" class="form-label"
                  ><strong>First name</strong></label
                >
                <input
                  v-model="userTableData.firstName"
                  type="text"
                  class="form-control mb-3"
                  id="first_name"
                  style="width: 300px"
                />

                {{ userTableData.isActive }}

                <label for="last_name" class="form-label"
                  ><strong>Last name</strong></label
                >
                <input
                  v-model="userTableData.lastName"
                  type="text"
                  class="form-control mb-3"
                  id="last_name"
                  style="width: 300px"
                />
                <label for="permissions" class="form-label"
                  ><strong>Permissions</strong></label
                >
                <p>Current permissions</p>
                <code v-html="userTableRecord.permissions"></code>
                <p />
                <p>New permissions</p>
                <input
                  v-model="userTableData.permissions"
                  type="text"
                  class="form-control mb-3"
                  id="permissions"
                  style="width: 300px"
                />
                <label for="last_login" class="form-label"
                  ><strong>Last login</strong></label
                >
                <input
                  type="text"
                  class="form-control mb-3"
                  id="last_login"
                  style="width: 300px"
                  :value="
                    userTableRecord.last_login
                      ? userTableRecord.last_login
                      : 'null'
                  "
                  disabled
                />
                <label for="created_at" class="form-label"
                  ><strong>Created at</strong></label
                >
                <input
                  type="text"
                  class="form-control mb-3"
                  id="created_at"
                  style="width: 300px"
                  :value="userTableRecord.created_at"
                  disabled
                />
                <label for="deleted_at" class="form-label"
                  ><strong>Deleted at</strong></label
                >
                <input
                  type="text"
                  class="form-control mb-3"
                  id="deleted_at"
                  style="width: 300px"
                  :value="
                    userTableRecord.deleted_at
                      ? userTableRecord.deleted_at
                      : 'null'
                  "
                  disabled
                />
              </div>

              <button
                type="submit"
                class="btn btn-primary"
                @click.prevent="updateThisUser()"
              >
                Update User
              </button>
              <button
                type="button"
                class="btn btn-secondary ms-3"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!-- Users table create Modal -->
    <div
      class="modal fade"
      id="createUsersTableModal"
      tabindex="-1"
      aria-labelledby="createUsersTableModalLabel"
      aria-hidden="true"
    >
      <div class="container"></div>
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="createUsersTableModalLabel">
              Create user
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <!-- Users table error -->
          <div
            v-if="usersTableError"
            class="alert alert-danger alert-dismissible fade show m-2"
            role="alert"
          >
            <strong>{{ usersTableError.message }}</strong>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
              @click="usersTableError = null"
            ></button>
          </div>

          <!-- Create user success notification -->
          <div
            v-if="createUserSuccessful"
            class="alert alert-success alert-dismissible fade show m-2"
            role="alert"
          >
            <strong>User created successfully</strong>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
              @click="createUserSuccessful = false"
            ></button>
          </div>

          <!-- Users create user modal body -->

          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label for="create_first_name" class="form-label"
                  ><strong>First name</strong></label
                >
                <input
                  v-model="createProfile.first_name"
                  type="text"
                  class="form-control mb-3"
                  id="create_first_name"
                  style="width: 300px"
                />
                <label for="create_last_name" class="form-label"
                  ><strong>Last name</strong></label
                >
                <input
                  v-model="createProfile.last_name"
                  type="text"
                  class="form-control mb-3"
                  id="create_last_name"
                  style="width: 300px"
                />
                <label for="create_email" class="form-label"
                  ><strong>Email</strong></label
                >
                <input
                  v-model="createProfile.email"
                  type="email"
                  class="form-control mb-3"
                  id="create_email"
                  style="width: 300px"
                />
                <label for="create_password" class="form-label"
                  ><strong>Password</strong></label
                >
                <input
                  v-model="createProfile.password"
                  type="password"
                  class="form-control mb-3"
                  id="create_password"
                  style="width: 300px"
                />
              </div>

              <button
                type="submit"
                class="btn btn-primary"
                @click.prevent="createThisUser()"
              >
                Create User
              </button>
              <button
                type="button"
                class="btn btn-secondary ms-3"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Users table -->
    <div>
      <h3>Users table</h3>
      <!-- Table get error -->
      <div
        v-if="usersTableGetError"
        class="alert alert-danger fade show m-2"
        role="alert"
      >
        <strong>{{ usersTableGetError.message }}</strong>
      </div>
      <div v-else>
        <button
          type="button"
          class="btn btn-success btn-sm mb-2 mt-2"
          data-bs-toggle="modal"
          data-bs-target="#createUsersTableModal"
        >
          Create User
        </button>
        <!-- Delete error -->
        <div
          v-if="usersTableDeleteError"
          class="alert alert-danger alert-dismissible fade show m-2"
          role="alert"
        >
          <strong>{{ usersTableDeleteError.message }}</strong>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            @click="usersTableDeleteError = null"
          ></button>
        </div>
        <!-- Users table -->
        <table class="table table-sm table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">id</th>
              <th scope="col">email</th>
              <th scope="col">first_name</th>
              <th scope="col">last_name</th>
              <th scope="col">edit</th>
              <th scope="col">delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in usersTable">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ row.id }}</td>
              <td>{{ row.email }}</td>
              <td>{{ row.first_name }}</td>
              <td>{{ row.last_name }}</td>
              <td>
                <button
                  type="button"
                  class="btn btn-warning btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#usersTableModal"
                  @click="
                    () => {
                      userTableRecord = row;
                      addUserTableData(row);
                    }
                  "
                >
                  edit
                </button>
              </td>
              <td>
                <button
                  type="button"
                  class="btn btn-danger btn-sm"
                  @click="
                    () => {
                      userTableRecord = row;
                      deleteThisUser(row);
                    }
                  "
                >
                  delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Refresh Tokens Session -->
    <div class="mt-5">
      <h3>Refresh Tokens Session</h3>
      <button
        type="button"
        class="btn btn-danger btn-sm mb-2 mt-2"
        @click="deleteAllTokens(csrfToken)"
      >
        Delete All
      </button>
      <p>
        <small
          >Deleting all will force every user to reauthenticate after their
          access tokens expire.</small
        >
      </p>
      <!-- Delete error -->
      <div
        v-if="refreshTokensTableDeleteError"
        class="alert alert-danger alert-dismissible fade show m-2"
        role="alert"
      >
        <strong>{{ refreshTokensTableDeleteError.message }}</strong>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          @click="refreshTokensTableDeleteError = null"
        ></button>
      </div>
      <!-- General refresh tokens error -->
      <div
        v-if="refreshTokensTableError"
        class="alert alert-danger alert-dismissible fade show m-2"
        role="alert"
      >
        <strong>{{ refreshTokensTableError.message }}</strong>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          @click="refreshTokensTableError = null"
        ></button>
      </div>
      <!-- Refresh tokens table -->
      <table class="table table-sm table-striped mb-5">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">id</th>
            <th scope="col">token_id</th>
            <th scope="col">user_id</th>
            <th scope="col">email</th>
            <th scope="col">is_active</th>
            <th scope="col">date_created</th>
            <th scope="col">delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in refreshTokensTable">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ row.id }}</td>
            <td>{{ row.token_id }}</td>
            <td>{{ row.user_id }}</td>
            <!-- Example only -->
            <td>
              <span v-if="usersTable">
                {{
                  usersTable.filter((user) => user.id === row.user_id)[0].email
                }}
              </span>
            </td>
            <td>{{ row.is_active }}</td>
            <td>{{ row.date_created }}</td>
            <td>
              <button
                type="button"
                class="btn btn-danger btn-sm"
                @click="
                  () => {
                    refreshTokenRecord = row;
                    deleteThisToken(row, csrfToken);
                  }
                "
              >
                delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-else>
    <div class="container">
      <div class="text-center text-danger">
        <h1>Access Forbidden</h1>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["profileUpdate"]);
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getRefreshTokens,
  deleteRefreshToken,
  deleteRefreshTokens,
} = useIamAdmin();
const selectedRole = ref("");
const isActive = ref(null);

// Some profile values
const profile = {
  uuid: "",
};

// Profile for creating user
const createProfile = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
};

// Get profile passed through attributes
const attrs = useAttrs();
profile.uuid = attrs.profile.uuid;
isActive.value = attrs.profile.isActive;

// Holds current user table record
const userTableRecord = ref(null);
const userTableData = {
  uuid: "",
  firstName: "",
  lastName: "",
  role: "",
  avatar: "",
  isActive: "",
  permissions: "",
};

// Holds current refresh token record
const refreshTokenRecord = ref(null);

// Users table variables
const usersTable = ref(null);
const usersTableError = ref(null);
const usersTableDeleteError = ref(null);
const usersTableGetError = ref(null);
const createUserSuccessful = ref(false);
const editUserSuccessful = ref(false);

// Refresh tokens table variables
const refreshTokensTableDeleteError = ref(null);
const refreshTokensTableError = ref(null);
const refreshTokensTable = ref(null);

// Csrf token
const csrfToken = ref(null);

onMounted(async () => {
  // Attempt to get users table data
  const getUsersData = await getUsers();

  // If error, report error, otherwise get data
  if (getUsersData.error) usersTableGetError.value = getUsersData.error;
  else {
    usersTable.value = getUsersData.data.users;
    csrfToken.value = getUsersData.data.csrf_token;
  }

  await getAllRefreshTokens();
});

/**
 * @desc Add user data to specific variables
 * @param tableData Data associated with users table
 */
function addUserTableData(tableData) {
  userTableData.uuid = tableData.uuid;
  userTableData.firstName = tableData.first_name;
  userTableData.lastName = tableData.last_name;
  userTableData.uuid = tableData.uuid;
  userTableData.isActive = tableData.is_active;
  userTableData.permissions = tableData.permissions;
}

/**
 * @desc Creates a new user record
 */
async function createThisUser() {
  // Validate first name
  if (!createProfile.first_name) {
    usersTableError.value = { message: "First name is required" };
    return;
  }

  // Validate last name
  if (!createProfile.last_name) {
    usersTableError.value = { message: "Last name is required" };
    return;
  }

  // Validate email
  if (!createProfile.email) {
    usersTableError.value = { message: "Email is required" };
    return;
  }

  // Validate password
  if (!createProfile.password) {
    usersTableError.value = { message: "Password is required" };
    return;
  }

  // Add csrf token
  createProfile.csrf_token = csrfToken.value;

  // Attempt to create new user
  const { error } = await createUser(createProfile);

  // If error, show error and return
  if (error) {
    usersTableError.value = error;
    return;
  }

  // If successful, reget users from database to update ui
  const getUsersResult = await getUsers();

  // If error, show error
  if (getUsersResult.error) {
    console.log(getUsersResult.error);
    usersTableError.value = getUsersResult.error;
    return;
  }

  // Otherwise update users table
  usersTable.value = getUsersResult.data.users;

  createUserSuccessful.value = true;
}

/**
 * @desc Updates a single user record
 */
async function updateThisUser() {
  const uuid = userTableData.uuid;
  const firstName = userTableData.firstName;
  const lastName = userTableData.lastName;
  const permissions = userTableData.permissions;

  // If we have a new selection for role, use that, otherwise, use the already selected role
  const role = selectedRole.value
    ? selectedRole.value
    : userTableRecord.value.role;

  // Create body to send to API
  const body = {
    first_name: firstName,
    last_name: lastName,
    role: role,
    is_active: userTableData.isActive === "true" ? true : false,
    permissions: permissions,
    csrf_token: csrfToken.value,
  };

  // Update user
  const updateUserResult = await updateUser(uuid, body);

  // If we get an error, show error
  if (updateUserResult.error) {
    console.log(updateUserResult.error);
    usersTableError.value = updateUserResult.error;
    return;
  }

  // If successful, emit profile update event and get users from database to update ui
  emit("profileUpdate");
  const getUsersResult = await getUsers();

  // If error, show error
  if (getUsersResult.error) {
    console.log(getUsersResult.error);
    usersTableGetError.value = getUsersResult.error;
    return;
  }

  // Otherwise update users table
  usersTable.value = getUsersResult.data.users;
  editUserSuccessful.value = true;
}

/**
 * @desc Deletes a single user record
 * @param record The record of the user to delete
 */
async function deleteThisUser(record) {
  // Cannot delete own record. Must go to profile
  if (profile.uuid === record.uuid) {
    usersTableDeleteError.value = {
      message: `You must use your profile settings to delete your own record`,
    };
    return;
  }

  // Attempt to delete User
  const deleteUserResult = await deleteUser(record.uuid, csrfToken.value);

  // If error, show error, and return
  if (deleteUserResult.error) {
    usersTableError.value = deleteUserResult.error;
    return;
  }

  // Otherwise update users table data
  const getUsersData = await getUsers();

  // If error, report error, otherwise get data
  if (getUsersData.error) usersTableGetError.value = getUsersData.error;
  else {
    usersTable.value = getUsersData.data.users;
    csrfToken.value = getUsersData.data.csrf_token;
  }
}

/**
 * @desc Get all refresh tokens
 */
async function getAllRefreshTokens() {
  // Attempt to get refresh tokens
  const getRefreshTokensData = await getRefreshTokens();

  // If error, report error, otherwise get data
  if (getRefreshTokensData.error)
    refreshTokensTableError.value = getRefreshTokensData.error;
  else refreshTokensTable.value = getRefreshTokensData.data;
}

/**
 * @desc Deletes a single refresh token
 * @param record The record of the token to delete
 */
async function deleteThisToken(record, csrfToken) {
  // Attempt to delete User
  const deleteTokenResult = await deleteRefreshToken(record.id, csrfToken);

  // If error, show error, and return
  if (deleteTokenResult.error) {
    refreshTokensTableError.value = deleteTokenResult.error;
    return;
  }

  // Otherwise refresh tokens table
  await getAllRefreshTokens();
}

/**
 * @desc Deletes all refresh token
 * @param csrfToken Csrf token
 */
async function deleteAllTokens(csrfToken) {
  // Attempt to delete User
  const deleteTokenResult = await deleteRefreshTokens(csrfToken);

  // If error, show error, and return
  if (deleteTokenResult.error) {
    refreshTokensTableError.value = deleteTokenResult.error;
    return;
  }

  // Empty table in user interface
  refreshTokensTable.value = null;
}
</script>

<style scoped>
table {
  font-size: 90%;
}
</style>
