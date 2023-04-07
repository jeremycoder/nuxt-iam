<template>
  <div>
    <h3>Users Table</h3>
    <button
      type="button"
      class="btn btn-success btn-sm mb-2 mt-2"
      :disabled="usersError !== null"
      @click="createUserNow = true"            
    >
      Create User
    </button> 

    <!-- Input form to create a user -->
    <div v-if="createUserNow">
      <iamObjectAsInputFormModal 
        :title="'Create User'"
        :description="'Create user below.'"
        :object="userToCreate"        
        @update="createThisUser($event)"
        @close="createUserNow = false" 
      />
    </div>   
    
    <!-- Error alert -->
    <div 
      v-if="usersError" 
      class="alert alert-danger alert-dismissible fade show" 
      role="alert">
      <strong>{{ usersError.message }}</strong>
      <button 
        type="button" 
        class="btn-close" 
        data-bs-dismiss="alert" 
        aria-label="Close" 
        @click="usersError = null">
      </button>
    </div>

    <!-- Success alert -->
    <div 
      v-if="usersSuccess" 
      class="alert alert-success alert-dismissible fade show" 
      role="alert">
      <strong>Success</strong>
      <button 
        type="button" 
        class="btn-close" 
        data-bs-dismiss="alert" 
        aria-label="Close" 
        @click="usersSuccess = false">
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

// Alerts
const usersError = ref(<Error|null>(null))
const usersSuccess = ref(false)

const displayedUsers = ref([] as Array<User>)
const users = ref([])
let userToUpdate = {} as User
let userToCreate = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',  
} as User
let updateUserNow = ref(false)
let createUserNow = ref(false)
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
  const { status, error, data } = await getUsers()
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
  else {
    const createError = error as Error
    usersError.value = createError
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
 * @desc Create user
 * @param user User to create
 */
async function createThisUser(user: User) {  
  // Attempt to update user  
  const { error } = await createUser(user)
  
  // If error, show error
  if (error) {
    const createError = error as Error
    usersError.value = createError
  } else {
    // Flash success message 
    usersSuccess.value = true
    setTimeout(() => { usersSuccess.value = false; }, 2000);
    await getAllUsers()
  }
}   


/**
 * @desc Send data to update user
 */
async function updateThisUser(user: User){  
  // Remove object properties that should not be updated
  removeBeforeSending.forEach((property) => {
    //@ts-ignore
    if (property in user) delete user[property]
  })

  // Add csrf token
  user.csrf_token = csrfToken   

  // Attempt to update user
  try {
    const { data } = await updateUser(user)    
    
    if (data) {
      // Flash success message 
      usersSuccess.value = true
      setTimeout(() => { usersSuccess.value = false; }, 2000);
      await getAllUsers()   
    }
  } catch (error) {    
    const updateError = error as Error
    usersError.value = updateError    
  }    
}

/**
 * @desc Send user data for deletion to api
 * @param event Event from emit
 */
async function deleteThisUser(user: User){   
  // 
  const clone = structuredClone(user)
  clone.csrf_token = csrfToken
  
 // Attempt to update user
 try {
    const { status } = await deleteUser(clone)     
    
    if (status === 'success') {
      // Flash success message
      usersSuccess.value = true
      setTimeout(() => { usersSuccess.value = false; }, 2000);
      await getAllUsers()   
    }
  } catch (error) {    
    const deleteError = error as Error
    usersError.value = deleteError    
  }    
}
</script>
