<template>
  <div>
    <h1 class="mt-5">Settings</h1>
    <p class="lead">Update your settings here.</p>
    <div class="row">
      <div class="col">
        <div class="card mb-3 mx-10" style="max-width: 25rem">
          <h4 class="card-header">Password</h4>
          <div class="card-body">
            <h5 class="card-title">Update Password</h5>
            <p>Update your password below.</p>
            <form>
              <div class="mb-3">
                <label for="current_password" class="form-label"
                  >Current Password</label
                >
                <input
                  type="password"
                  class="form-control mb-3"
                  id="current_password"
                  style="width: 300px"
                />
                <label for="new_password" class="form-label"
                  >New Password</label
                >
                <input
                  type="password"
                  class="form-control mb-3"
                  id="new_password"
                  style="width: 300px"
                />
                <label for="confirm_password" class="form-label"
                  >Confirm New Password</label
                >
                <input
                  type="password"
                  class="form-control mb-3"
                  id="confirm_password"
                  style="width: 300px"
                />
              </div>
              <button type="submit" class="btn btn-primary">
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="card mb-3 mx-10 my-10" style="max-width: 25rem">
          <h4 class="card-header">Account</h4>
          <div class="card-body">
            <h5 class="card-title text-danger">Delete Account</h5>
            <p>
              Deleting your account is a permanent action and cannot be undone.
              If you are sure you want to delete your account, click the button
              below.
            </p>
            <button type="submit" class="btn btn-danger">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
