<template>
  <div class="container">
    <div class="page-header">
      <h2>Admin</h2>
    </div>
    <p>Administer users here.</p>
    <!-- Users table -->
    <div>
      <div class="table-title">
        <div class="row">
          <div class="col-sm-8">
            <h2>Users</h2>
          </div>
          <div class="col-sm-4">
            <button type="button" class="btn btn-info add-new">
              <i class="fa fa-plus"></i> Add New
            </button>
          </div>
        </div>
      </div>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>Administration</td>
            <td>(171) 555-2222</td>
            <td>
              <a class="add" title="Add" data-toggle="tooltip"
                ><i class="material-icons">&#xE03B;</i></a
              >
              <a class="edit" title="Edit" data-toggle="tooltip"
                ><i class="material-icons">&#xE254;</i></a
              >
              <a class="delete" title="Delete" data-toggle="tooltip"
                ><i class="material-icons">&#xE872;</i></a
              >
            </td>
          </tr>
          <tr>
            <td>Peter Parker</td>
            <td>Customer Service</td>
            <td>(313) 555-5735</td>
            <td>
              <a class="add" title="Add" data-toggle="tooltip"
                ><i class="material-icons">&#xE03B;</i></a
              >
              <a class="edit" title="Edit" data-toggle="tooltip"
                ><i class="material-icons">&#xE254;</i></a
              >
              <a class="delete" title="Delete" data-toggle="tooltip"
                ><i class="material-icons">&#xE872;</i></a
              >
            </td>
          </tr>
          <tr>
            <td>Fran Wilson</td>
            <td>Human Resources</td>
            <td>(503) 555-9931</td>
            <td>
              <a class="add" title="Add" data-toggle="tooltip"
                ><i class="material-icons">&#xE03B;</i></a
              >
              <a class="edit" title="Edit" data-toggle="tooltip"
                ><i class="material-icons">&#xE254;</i></a
              >
              <a class="delete" title="Delete" data-toggle="tooltip"
                ><i class="material-icons">&#xE872;</i></a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Users table permissions-->
    <div>
      <div class="table-title">
        <div class="row">
          <div class="col-sm-8">
            <h2>Users Table <b>Permissions</b></h2>
          </div>
          <div class="col-sm-4">
            <button type="button" class="btn btn-info add-new">
              <i class="fa fa-plus"></i> Add New
            </button>
          </div>
        </div>
      </div>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>Administration</td>
            <td>(171) 555-2222</td>
            <td>
              <a class="add" title="Add" data-toggle="tooltip"
                ><i class="material-icons">&#xE03B;</i></a
              >
              <a class="edit" title="Edit" data-toggle="tooltip"
                ><i class="material-icons">&#xE254;</i></a
              >
              <a class="delete" title="Delete" data-toggle="tooltip"
                ><i class="material-icons">&#xE872;</i></a
              >
            </td>
          </tr>
          <tr>
            <td>Peter Parker</td>
            <td>Customer Service</td>
            <td>(313) 555-5735</td>
            <td>
              <a class="add" title="Add" data-toggle="tooltip"
                ><i class="material-icons">&#xE03B;</i></a
              >
              <a class="edit" title="Edit" data-toggle="tooltip"
                ><i class="material-icons">&#xE254;</i></a
              >
              <a class="delete" title="Delete" data-toggle="tooltip"
                ><i class="material-icons">&#xE872;</i></a
              >
            </td>
          </tr>
          <tr>
            <td>Fran Wilson</td>
            <td>Human Resources</td>
            <td>(503) 555-9931</td>
            <td>
              <a class="add" title="Add" data-toggle="tooltip"
                ><i class="material-icons">&#xE03B;</i></a
              >
              <a class="edit" title="Edit" data-toggle="tooltip"
                ><i class="material-icons">&#xE254;</i></a
              >
              <a class="delete" title="Delete" data-toggle="tooltip"
                ><i class="material-icons">&#xE872;</i></a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Refresh tokens -->
    <div>
      <div class="table-title">
        <div class="row">
          <div class="col-sm-8">
            <h2>Refresh <b>Tokens</b></h2>
          </div>
          <div class="col-sm-4">
            <button type="button" class="btn btn-info add-new">
              <i class="fa fa-plus"></i> Add New
            </button>
          </div>
        </div>
      </div>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>Administration</td>
            <td>(171) 555-2222</td>
            <td>
              <a class="add" title="Add" data-toggle="tooltip"
                ><i class="material-icons">&#xE03B;</i></a
              >
              <a class="edit" title="Edit" data-toggle="tooltip"
                ><i class="material-icons">&#xE254;</i></a
              >
              <a class="delete" title="Delete" data-toggle="tooltip"
                ><i class="material-icons">&#xE872;</i></a
              >
            </td>
          </tr>
          <tr>
            <td>Peter Parker</td>
            <td>Customer Service</td>
            <td>(313) 555-5735</td>
            <td>
              <a class="add" title="Add" data-toggle="tooltip"
                ><i class="material-icons">&#xE03B;</i></a
              >
              <a class="edit" title="Edit" data-toggle="tooltip"
                ><i class="material-icons">&#xE254;</i></a
              >
              <a class="delete" title="Delete" data-toggle="tooltip"
                ><i class="material-icons">&#xE872;</i></a
              >
            </td>
          </tr>
          <tr>
            <td>Fran Wilson</td>
            <td>Human Resources</td>
            <td>(503) 555-9931</td>
            <td>
              <a class="add" title="Add" data-toggle="tooltip"
                ><i class="material-icons">&#xE03B;</i></a
              >
              <a class="edit" title="Edit" data-toggle="tooltip"
                ><i class="material-icons">&#xE254;</i></a
              >
              <a class="delete" title="Delete" data-toggle="tooltip"
                ><i class="material-icons">&#xE872;</i></a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Refresh tokens -->
    <div>
      <div class="table-title">
        <div class="row">
          <div class="col-sm-8">
            <h2>One-time <b>Tokens</b></h2>
          </div>
          <div class="col-sm-4">
            <button type="button" class="btn btn-info add-new">
              <i class="fa fa-plus"></i> Add New
            </button>
          </div>
        </div>
      </div>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>Administration</td>
            <td>(171) 555-2222</td>
            <td>
              <a class="add" title="Add" data-toggle="tooltip"
                ><i class="material-icons">&#xE03B;</i></a
              >
              <a class="edit" title="Edit" data-toggle="tooltip"
                ><i class="material-icons">&#xE254;</i></a
              >
              <a class="delete" title="Delete" data-toggle="tooltip"
                ><i class="material-icons">&#xE872;</i></a
              >
            </td>
          </tr>
          <tr>
            <td>Peter Parker</td>
            <td>Customer Service</td>
            <td>(313) 555-5735</td>
            <td>
              <a class="add" title="Add" data-toggle="tooltip"
                ><i class="material-icons">&#xE03B;</i></a
              >
              <a class="edit" title="Edit" data-toggle="tooltip"
                ><i class="material-icons">&#xE254;</i></a
              >
              <a class="delete" title="Delete" data-toggle="tooltip"
                ><i class="material-icons">&#xE872;</i></a
              >
            </td>
          </tr>
          <tr>
            <td>Fran Wilson</td>
            <td>Human Resources</td>
            <td>(503) 555-9931</td>
            <td>
              <a class="add" title="Add" data-toggle="tooltip"
                ><i class="material-icons">&#xE03B;</i></a
              >
              <a class="edit" title="Edit" data-toggle="tooltip"
                ><i class="material-icons">&#xE254;</i></a
              >
              <a class="delete" title="Delete" data-toggle="tooltip"
                ><i class="material-icons">&#xE872;</i></a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.table-wrapper {
  width: 700px;
  margin: 30px auto;
  background: #fff;
  padding: 20px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}
.table-title {
  padding-bottom: 10px;
  margin: 0 0 10px;
}
.table-title h2 {
  margin: 6px 0 0;
  font-size: 22px;
}
.table-title .add-new {
  float: right;
  height: 30px;
  font-weight: bold;
  font-size: 12px;
  text-shadow: none;
  min-width: 100px;
  border-radius: 50px;
  line-height: 13px;
}
.table-title .add-new i {
  margin-right: 4px;
}
table.table {
  table-layout: fixed;
}
table.table tr th,
table.table tr td {
  border-color: #e9e9e9;
}
table.table th i {
  font-size: 13px;
  margin: 0 5px;
  cursor: pointer;
}
table.table th:last-child {
  width: 100px;
}
table.table td a {
  cursor: pointer;
  display: inline-block;
  margin: 0 5px;
  min-width: 24px;
}
table.table td a.add {
  color: #27c46b;
}
table.table td a.edit {
  color: #ffc107;
}
table.table td a.delete {
  color: #e34724;
}
table.table td i {
  font-size: 19px;
}
table.table td a.add i {
  font-size: 24px;
  margin-right: -1px;
  position: relative;
  top: 3px;
}
table.table .form-control {
  height: 32px;
  line-height: 32px;
  box-shadow: none;
  border-radius: 2px;
}
table.table .form-control.error {
  border-color: #f50000;
}
table.table td .add {
  display: none;
}
</style>
