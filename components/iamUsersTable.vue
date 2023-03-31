<template>
  <div>
    <h3>Users Table</h3>
    <iamTable v-if="users" 
      :data=displayedUsers       
      @update="updateThisUser($event)" 
      @delete="deleteThisUser($event)" 
    />
  </div>
</template>

<script setup lang="ts">

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,  
} = useIamAdmin();

const { status, data } = await getUsers()
const displayedUsers = ref([])
const users = ref([])
let clone = null

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
  clone = structuredClone(data.users);
  console.log('clone: ', clone)

  console.log('users: ', users.value)

  // Remove keys from objects to display in table
  users.value.forEach((user) => {
    Object.keys(user).forEach((key) => {
      if (!show.includes(key)) delete user[key]
    })
    
    // Users displayed in table
    displayedUsers.value.push(user)
  })  
  
}

function updateThisUser(event: Event){
  console.log('update')
  console.log('event: ', event)
}

function deleteThisUser(event: Event){
  console.log('delete')
  console.log('event: ', event)
}



</script>
