<template>
  <div>
    <h3>Users Table</h3>
    <button
      type="button"
      class="btn btn-success btn-sm mb-2 mt-2"            
        >
          Create User
    </button> 
    
    <!-- Error alert -->
    <div 
      v-if="usersError" 
      class="alert alert-danger alert-dismissible fade show" 
      role="alert">
      <strong>{{ usersError }}</strong>
      <button 
        type="button" 
        class="btn-close" 
        data-bs-dismiss="alert" 
        aria-label="Close" 
        @close="usersError = null">
      </button>
    </div>
      
    <!-- Input form to update users -->
    <div v-if="updateUserNow">
      <iamObjectAsInputFormModal 
        :title="'Update User'"
        :description="'Update user below.'"
        :object="userToUpdate" 
        :disabled="disabled"
        :asSelect1="'role'"
        :selectOptions1="roles"
        :asBoolean1="'is_active'"
        @update="updateThisUser($event)"
        @close="updateUserNow = false" 
      />
    </div>        
      
      <!-- Display users object as an HTML table -->
      <iamObjectsAsTable v-if="users" 
        :data=displayedUsers       
        @update="getUserToUpdate($event)" 
        @delete="deleteThisUser($event)" 
      />
  </div>
</template>

<script setup lang="ts">
import { User } from "~~/iam/misc/types";

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,  
} = useIamAdmin();

// The only columns to show
const show = [
  'id',
  'uuid',
  'email',
  'first_name',
  'last_name',
]

// Disabled input
const disabled = [
  'id',
  'uuid',
  'email',
  'password',
  'email_verified',
  'role',
  'is_active',
  'last_login',
  'created_at',
  'deleted_at',
  'updated_at',
]

// Properties to remove before sending to backend
// Any items that cannot be edited except the uuid which is required
const removeBeforeSending = [
  'id',
  'email',
  'password',
  'email_verified',
  'last_login',
  'created_at',
  'deleted_at',
  'updated_at',
]

// User roles
const roles = [
  'SUPER_ADMIN',
  'ADMIN',
  'GENERAL'
]

const usersError = ref(<string|null|unknown>(null))

const displayedUsers = ref([])
const users = ref([])
let userToUpdate = {} as User
let updateUserNow = ref(false)
let allUsers = [] as Array<User>
let csrfToken = ''

// Result of calling getUsers()
onMounted(async () => {
  await getAllUsers();  
});


/**
 * @desc Get all users
 */
async function getAllUsers() {
  const { status, data } = await getUsers()
  if (status === 'success') {
    // Get all users    
    users.value = structuredClone(data.users)
    allUsers = structuredClone(data.users);
    
    // Get csrf token
    csrfToken = data.csrf_token  

    // Remove keys from objects to display in table
    displayedUsers.value = []
    users.value.forEach((user) => {
      Object.keys(user).forEach((key) => {
        if (!show.includes(key)) delete user[key]
      })
      
      // Users displayed in table
      displayedUsers.value.push(user)
    })  
    
  }
}

/**
 * @desc Receive user data from table and finds corresponding user in local variable
 * @param user User to update
 */
function getUserToUpdate(user: User){  
  const findUser = allUsers.filter(oneUser => oneUser.id == user.id)  
  userToUpdate = findUser[0]
  updateUserNow.value = true    
}

/**
 * @desc Send data to update user
 */
async function updateThisUser(user: User){   
  console.log('usersError: ', usersError.value) 
  // Remove object properties that should not be updated
  removeBeforeSending.forEach((property) => {
    //@ts-ignore
    if (property in user) delete user[property]
  })

  // Add csrf token and send user to backend
  user.csrf_token = ''  

  // Attempt to update user
  try {
    await updateUser(user.uuid, user)
    await getAllUsers()   
  } catch (error) {
    usersError.value = error
    console.log('error: ', error)
  }    
}

/**
 * @desc Send user data for deletion to api
 * @param event Event from emit
 */
async function deleteThisUser(user: User){

  // Add csrf token and send user to backend
  user.csrf_token = csrfToken

  // Attempt to delete user
  try {
    await deleteUser(user.uuid, user.csrf_token)
    await getAllUsers()   
  } catch (error) {
    usersError.value = error
    console.log('error: ', error)
  }
}
</script>
