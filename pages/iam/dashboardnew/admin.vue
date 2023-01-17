<template>
  <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
    >
      <h1 class="h2">Admin</h1>
    </div>
    <p>Administer users here.</p>
    <h4>Users</h4>
    <div class="table-responsive mb-10">
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>
              <span class="badge rounded-pill text-bg-warning">edit</span>
            </td>
            <td>
              <span class="badge rounded-pill text-bg-danger">delete</span>
            </td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
            <td>
              <span class="badge rounded-pill text-bg-warning">edit</span>
            </td>
            <td>
              <span class="badge rounded-pill text-bg-danger">delete</span>
            </td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry the Bird</td>
            <td>@twitter</td>
            <td>@twitter</td>
            <td>
              <span class="badge rounded-pill text-bg-warning">edit</span>
            </td>
            <td>
              <span class="badge rounded-pill text-bg-danger">delete</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script setup></script>
