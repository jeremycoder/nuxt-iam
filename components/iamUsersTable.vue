<template>
  <div>
    <h3>Users Table</h3>
    <button
      type="button"
      class="btn btn-success btn-sm mb-2 mt-2"
      data-bs-toggle="modal"
      data-bs-target="#createUserTableModal"      
        >
          Create User
      </button>
      <!-- Create users table modal -->
      <div class="modal fade" id="createUserTableModal" tabindex="-1" aria-labelledby="createUserTableModal" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Edit User</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col">
                  <div class="card mb-3 mx-10" style="max-width: 25rem">
                    <h4 class="card-header">Profile</h4>
                    <div class="card-body">
                      <h5 class="card-title">Update Profile</h5>
                      <p>Update your profile below.</p>
                        <!-- Data here-->                        
                        <form class="mb-5">
                          <div class="mb-3">
                            <label for="key" class="form-label">Value</label>
                            <input
                              type="text"
                              class="form-control mb-3"
                              id="key"                
                              value="value"
                              disabled
                            />
                          </div>                  
                          <button
                            type="submit"
                            class="btn btn-primary"
                            @click.prevent="updateThisUser()"
                          >
                            Update My Profile
                          </button>
                        </form>
                    </div>
                  </div>
                </div>
              </div>  
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>   

       <!-- Update users table modal -->
      <div v-if="updateUserNow" class="card mb-3 mx-10" style="max-width: 25rem">
        <h4 class="card-header">Update User</h4>
        <div class="card-body">                      
          <p>Update the User below</p>
            <!-- Data here--> 
            {{ userToUpdate }}                       
            <form class="mb-5">
              <div class="mb-3">
                <label for="key" class="form-label">Value</label>
                <input
                  type="text"
                  class="form-control mb-3"
                  id="key"                
                  value="value"
                  disabled
                />
              </div>                  
              <button
                type="submit"
                class="btn btn-primary"
                @click.prevent="updateThisUser()"
              >
                Update My Profile
              </button>
              <button
                type="submit"
                class="btn btn-secondary ms-2"
                @click.prevent="updateUserNow = false"
              >
                Close
              </button>
            </form>
        </div>
      </div>   
      
    <iamTable v-if="users" 
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

const { status, data } = await getUsers()
const displayedUsers = ref([])
const users = ref([])
let userToUpdate = {} as User
let updateUserNow = ref(false)
let allUsers = [] as Array<User>

// The only columns to show
const show = [
  'id',
  'uuid',
  'email',
  'first_name',
  'last_name',
]

if (status === 'success') {
  // Get all users
  users.value = structuredClone(data.users)
  allUsers = structuredClone(data.users);  

  // Remove keys from objects to display in table
  users.value.forEach((user) => {
    Object.keys(user).forEach((key) => {
      if (!show.includes(key)) delete user[key]
    })
    
    // Users displayed in table
    displayedUsers.value.push(user)
  })  
  
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
function updateThisUser(){
  console.log('Send data to composable ---> api')
}

function deleteThisUser(event: Event){
  console.log('delete')
  console.log('event: ', event)
}



</script>
