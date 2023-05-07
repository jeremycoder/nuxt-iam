<template>
  <div>
    <h2>Users Table</h2>
    <NxButton
      class="create-button"
      theme="success"
      @click="createUserNow = true"
      >Create User</NxButton
    >

    <!-- Create user modal -->
    <NxModal v-if="createUserNow" @close="createUserNow = false">
      <NxCard
        header="Create a User"
        theme="primary"
        text="Enter information to create a user."
      >
        <NxForm :data="createUserInputData" @submit="createUserOutput" />
      </NxCard>
    </NxModal>

    <!-- Error alert -->
    <NxAlert v-if="usersError" theme="danger" @click="usersError = null"
      ><strong>{{ usersError.message }}</strong></NxAlert
    >

    <!-- Success alert -->
    <NxAlert v-if="usersSuccess" theme="success" @click="usersSuccess = false"
      ><strong>Success</strong></NxAlert
    >

    <!-- Input form to update users -->
    <NxModal v-if="updateUserNow" @close="updateUserNow = false">
      <NxCard
        header="Update User"
        :max-width="30"
        theme="success"
        text="Update user below."
      >
        <NxForm
          :data="prepareUserToUpdate(userToUpdate)"
          :return-keys="returnKeys"
          @submit="updateThisUser"
        />
      </NxCard>
    </NxModal>

    <!-- Display users object as an HTML table -->
    <NxObjectAsTable
      v-if="users"
      :data="displayedUsers"
      @update="getUserToUpdate($event)"
      @delete="deleteThisUser($event)"
    />
  </div>
</template>

<script setup lang="ts">
import { User, NxFormInput } from "~~/iam/misc/types";
const { getUsers, createUser, updateUser, deleteUser } = useIamAdmin();

// Data for input form
const createUserInputData = [
  {
    label: "First Name",
    id: "first_name",
    type: "input:text",
  },
  {
    label: "Last Name",
    id: "last_name",
    type: "input:text",
  },
  {
    label: "Email",
    id: "email",
    type: "input:email",
  },
  {
    label: "Password",
    id: "password",
    type: "input:password",
  },
] as Array<NxFormInput>;

// The only columns to show
const show = ["id", "uuid", "email", "first_name", "last_name"];

// Disabled keys in user object
const disabledKeys = [
  "id",
  "uuid",
  "email",
  "password",
  "email_verified",
  "last_login",
  "created_at",
  "deleted_at",
  "updated_at",
];

// Keys that should always be returned from user update form
const returnKeys = ["uuid"];

// User roles
const roles = ["SUPER_ADMIN", "ADMIN", "GENERAL"];

// Alerts
const usersError = ref(<Error | null>null);
const usersSuccess = ref(false);

const displayedUsers = ref([] as Array<User>);
const users = ref([]);
let userToUpdate = {} as User;

let updateUserNow = ref(false);
let createUserNow = ref(false);
let allUsers = [] as Array<User>;
let csrfToken = "";

// Result of calling getUsers()
onMounted(async () => {
  await getAllUsers();
});

/**
 * @desc Get all users
 */
async function getAllUsers() {
  const { status, error, data } = await getUsers();
  if (status === "success") {
    // Get all users
    users.value = structuredClone(data.users);
    allUsers = structuredClone(data.users);

    // Get csrf token
    csrfToken = data.csrf_token;

    // Remove keys from objects to display in table
    displayedUsers.value = [];
    users.value.forEach((user) => {
      Object.keys(user).forEach((key) => {
        if (!show.includes(key)) delete user[key];
      });

      // Users displayed in table
      displayedUsers.value.push(user);
    });
  } else {
    usersError.value = error;
  }
}

/**
 * @desc Receive user data from table and finds corresponding user in local variable
 * @param user User to update
 */
function getUserToUpdate(user: User) {
  const findUser = allUsers.filter((oneUser) => oneUser.id == user.id);
  userToUpdate = findUser[0];
  updateUserNow.value = true;
}

/**
 * @desc Get the user to edit and convert the user to NxFormInput
 * @param user The user to edit
 */
function prepareUserToUpdate(user: User): Array<NxFormInput> {
  const form = [] as Array<NxFormInput>;
  // Iterate through user
  for (const key in user) {
    const temp = {} as NxFormInput;
    temp.id = key;
    temp.label = key;

    // If key is 'roles', add select
    if (key === "role") {
      temp.type = "select";
      temp.options = roles;
    } else if (key === "is_active") {
      temp.type = "select";
      temp.options = ["true", "false"];
    } else {
      temp.type = "input:text";
    }

    /*@ts-ignore */
    temp.value = user[key];

    // Disable key if it should be disabled
    if (disabledKeys.includes(key)) temp.disabled = true;

    form.push(temp);
  }

  return form;
}

/**
 * @desc Create user
 * @param user User to create
 */
async function createThisUser(user: User) {
  // Attempt to update user
  const { error } = await createUser(user);

  // If error, show error
  if (error) {
    usersError.value = error;
  } else {
    // Flash success message
    usersSuccess.value = true;
    setTimeout(() => {
      usersSuccess.value = false;
    }, 2000);
    await getAllUsers();
  }
}

/**
 * @desc Send data to update user
 */
async function updateThisUser(user: User) {
  // Add csrf token
  user.csrf_token = csrfToken;

  // Change any boolean values from boolean string to boolean data type
  for (const key in user) {
    /*@ts-ignore */
    if (user[key] === "true") user[key] = true;
    /*@ts-ignore */
    if (user[key] === "false") user[key] = false;
  }

  // Attempt to update user
  const { data, error } = await updateUser(user);

  // If successful, flash success message
  if (data) {
    usersSuccess.value = true;
    setTimeout(() => {
      usersSuccess.value = false;
    }, 2000);
    await getAllUsers();
  }

  // If error, show error
  if (error) {
    usersError.value = error;
  }
}

/**
 * @desc Send user data for deletion to api
 * @param event Event from emit
 */
async function deleteThisUser(user: User) {
  //
  const clone = structuredClone(user);
  clone.csrf_token = csrfToken;

  // Attempt to update user
  try {
    const { status } = await deleteUser(clone);

    if (status === "success") {
      // Flash success message
      usersSuccess.value = true;
      setTimeout(() => {
        usersSuccess.value = false;
      }, 2000);
      await getAllUsers();
    }
  } catch (error) {
    const deleteError = error as Error;
    usersError.value = deleteError;
  }
}

/**
 * Receives data to create a user and calls function to create user
 * @param userData Data to create a user
 */
function createUserOutput(userData: User) {
  createUserNow.value = false;

  // Prepare error object
  usersError.value = {} as Error;

  // Validate user input
  if ("first_name" in userData === false) {
    usersError.value.message = "first_name is required";
    return;
  }

  if ("last_name" in userData === false) {
    usersError.value.message = "last_name is required";
    return;
  }

  if ("email" in userData === false) {
    usersError.value.message = "email is required";
    return;
  }

  if ("password" in userData === false) {
    usersError.value.message = "password is required";
    return;
  }

  createThisUser(userData);
}
</script>

<style scoped>
.create-button {
  margin-bottom: 2rem;
}
</style>
