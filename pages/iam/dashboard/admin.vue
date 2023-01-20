<template>
  <div>
    <div>
      <h1 class="mt-5">Admin</h1>
      <p class="lead">This is your admin center.</p>
    </div>
    <!-- Admin errors notification -->
    <div
      v-if="adminError"
      class="alert alert-danger alert-dismissible fade show"
      role="alert"
    >
      <strong>{{ adminError.message }}</strong>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        @click="adminError = null"
      ></button>
    </div>
    <!-- Admin success notification -->
    <div
      v-if="updateSuccessful"
      class="alert alert-success alert-dismissible fade show"
      role="alert"
    >
      <strong>Data updated successfully</strong>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        @click="updateSuccessful = false"
      ></button>
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
              Modal title
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
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
                <label for="email" class="form-label"
                  ><strong>Email verified</strong></label
                >
                <input
                  type="email"
                  class="form-control mb-3"
                  id="email"
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
                <label for="created_at" class="form-label"
                  ><strong>Deleted at</strong></label
                >
                <input
                  type="text"
                  class="form-control mb-3"
                  id="created_at"
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
    <!-- Users table -->
    <div>
      <!-- {{ usersTable }} -->
      <h3>Users table</h3>
      <!-- Users table error -->
      <div
        v-if="usersTableError"
        class="alert alert-danger alert-dismissible fade show"
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
</template>

<script setup>
const emit = defineEmits(["profileUpdate"]);
const { getUsers, updateUser, deleteUser } = useIamAdmin();
const selectedRole = ref("");

// Some profile values
const profile = {
  uuid: "",
};

// Get profile passed through attributes
const attrs = useAttrs();
profile.uuid = attrs.profile.uuid;

// Holds current user table record
const userTableRecord = ref(null);
const userTableData = {
  uuid: "",
  firstName: "",
  lastName: "",
  role: "",
};

// Error variables
const updateSuccessful = ref(false);
let adminError = ref(null);

// Prepare table variables
const usersTable = ref(null);
const usersTableError = ref(null);
const usersTablePermsTable = ref(null);
const refreshTokensTable = ref(null);
const oneTimeTokensTable = ref(null);

// Get users, check for error

onMounted(async () => {
  // Attempt to get users table data
  const { error, data } = await getUsers();

  // If error, report error, otherwise get data
  if (error) {
    usersTableError.value = error;
  } else {
    usersTable.value = data;
  }
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
}

/**
 * @desc Updates a single user record
 */
async function updateThisUser() {
  // TODO: Need to get updated form data
  const uuid = userTableData.uuid;
  const firstName = userTableData.firstName;
  const lastName = userTableData.lastName;

  // If we have a new selection for role, use that, otherwise, use the already selected role
  const role = selectedRole.value
    ? selectedRole.value
    : userTableRecord.value.role;

  // Create body to send to API
  const body = {
    first_name: firstName,
    last_name: lastName,
    role: role,
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
    usersTableError.value = getUsersResult.error;
    return;
  }

  // Otherwise update users table
  usersTable.value = getUsersResult.data;
  updateSuccessful.value = true;
}

/**
 * @desc DEletes a single user record
 */
async function deleteThisUser(record) {
  // Cannot delete own record. Must go to profile
  if (profile.uuid === record.uuid) {
    usersTableError.value = {
      message: "You must use your profile to delete your own record",
    };
    return;
  }

  // Attempt to delete User
  const deleteUserResult = await deleteUser(record.uuid);

  // If error, show error, and return
  if (deleteUserResult.error) {
    usersTableError.value = deleteUserResult.error;
    return;
  }

  // Otherwise update users table
  usersTable.value = deleteUserResult.data;
  updateSuccessful.value = true;
}
</script>
