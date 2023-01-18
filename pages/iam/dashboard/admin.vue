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
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">{{ currentRecord }}</div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button type="button" class="btn btn-primary">Save changes</button>
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
              data-bs-target="#exampleModal"
              @click="currentRecord = row"
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
                  currentRecord = row;
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
const attrs = useAttrs();
const profile = attrs.profile;

// Holds current record
const currentRecord = ref(null);

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

function deleteRecord(record) {
  console.log("DELETE: ", record);
}
</script>
