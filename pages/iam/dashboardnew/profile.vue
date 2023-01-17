<template>
  <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">Profile</h1>
    </div>
    <p>Update your profile here.</p>
    <form>
      <div class="mb-3">
        <label for="text" class="form-label">Uuid</label>
        <input
          type="text"
          class="form-control mb-3"
          id="uuid"
          style="width: 300px"
          disabled
        />
        <label for="email" class="form-label">Email address</label>
        <input
          type="email"
          class="form-control mb-3"
          id="email"
          style="width: 300px"
          disabled
        />
        <label for="role" class="form-label">Role</label>
        <input
          type="text"
          class="form-control mb-3"
          id="role"
          style="width: 300px"
          disabled
        />
        <label for="first_name" class="form-label">First name</label>
        <input
          type="text"
          class="form-control mb-3"
          id="first_name"
          style="width: 300px"
        />
        <label for="last_name" class="form-label">Last name</label>
        <input
          type="text"
          class="form-control mb-3"
          id="last_name"
          style="width: 300px"
        />
      </div>

      <button type="submit" class="btn btn-primary">Update Profile</button>
    </form>
  </main>
</template>

<script setup></script>
