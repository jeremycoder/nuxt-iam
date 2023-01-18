<template>
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
  <!-- Edit Modal -->
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
              <label for="text" class="form-label">Uuid</label>
              <input
                type="text"
                class="form-control mb-3"
                id="uuid"
                style="width: 300px"
                :value="userTableRecord.uuid"
                disabled
              />
              <label for="email" class="form-label">Email address</label>
              <input
                type="email"
                class="form-control mb-3"
                id="email"
                style="width: 300px"
                :value="userTableRecord.email"
                disabled
              />
              <label for="email" class="form-label">Email verified</label>
              <input
                type="email"
                class="form-control mb-3"
                id="email"
                style="width: 300px"
                :value="userTableRecord.email_verified"
                disabled
              />
              <label for="role" class="form-label">Role</label>
              <input
                type="text"
                class="form-control mb-3"
                id="role"
                style="width: 300px"
                :value="userTableRecord.role"
                disabled
              />
              <label for="first_name" class="form-label">First name</label>
              <input
                v-model="userTableData.firstName"
                type="text"
                class="form-control mb-3"
                id="first_name"
                style="width: 300px"
              />
              <label for="last_name" class="form-label">Last name</label>
              <input
                v-model="userTableData.lastName"
                type="text"
                class="form-control mb-3"
                id="last_name"
                style="width: 300px"
              />
              <label for="last_login" class="form-label">Last login</label>
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
              <label for="created_at" class="form-label">Created at</label>
              <input
                type="text"
                class="form-control mb-3"
                id="created_at"
                style="width: 300px"
                :value="userTableRecord.created_at"
                disabled
              />
              <label for="created_at" class="form-label">Deleted at</label>
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
              @click.prevent="updateUser()"
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
  <div v-else="usersTable">
    <!-- {{ usersTable }} -->
    <h3>Users table</h3>
    <table class="table table-sm table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
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
                  deleteRecord(row);
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
</template>

<script setup>
const { getUsers } = useIamAdmin();

// Holds current user table record
const userTableRecord = ref(null);
const userTableData = {
  uuid: "",
  firstName: "",
  lastName: "",
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
function updateUser() {
  // TODO: Need to get updated form data
  const uuid = userTableData.uuid;
  const firstName = userTableData.firstName;
  const lastName = userTableData.lastName;

  console.log("uuid: ", uuid);
  console.log("first name: ", firstName);
  console.log("last name: ", lastName);

  // Update user
}

function deleteRecord(record) {
  console.log("DELETE: ", record);
}
</script>
