<!-- This component displays an array of objects as a table -->
<template>
  <div>
    <h3>{{ props.title }}</h3>
    <div v-if="props.data && props.data.length">
      <table class="table table-sm table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th v-for="(objectKey) in Object.keys(props.data[0])" scope="col">{{ objectKey }}</th>
            <th v-if="!props.removeEdit" scope="col">edit</th>
            <th v-if="!props.removeDelete" scope="col">delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in props.data">
            <td scope="row">{{ rowIndex + 1 }}</td>
            <td v-for="(value, colIndex) in Object.values(row)" :data-col="Object.keys(props.data[0])[colIndex]"
              scope="col" ref="input">
              {{ value }}
            </td>
            <td v-if="!props.removeEdit">
              <NxButton theme="warning" size="small" @click="updateRow(rowIndex + 1, row)">update</NxButton>
            </td>
            <td v-if="!props.removeDelete">
              <NxButton theme="danger" size="small" @click="deleteRow(row)">delete</NxButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <h3>Table data not found</h3>
    </div>


  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["update", "delete"]);

const props = defineProps({
  title: String,
  data: Array<Object>,
  removeEdit: Boolean,
  removeDelete: Boolean,
})

// Array of all table cells
const input = ref(Array<HTMLTableCellElement>())

/**
 * Extracts row from table and emits data
 * @param rowIndex The number of the row (1,2,3...)
 * @param row Object containing a row of data
 */
function updateRow(rowIndex: number, row: Object) {
  let keyLength = 0

  // Get number of keys (columns) in the table
  if (props.data && props.data[0])
    keyLength = Object.keys(props.data[0]).length

  // Extract rows from table
  for (let i = (rowIndex * keyLength) - keyLength; i <= ((rowIndex * keyLength) - keyLength) + (keyLength - 1); i++) {
    const tableCell = input.value[i] as HTMLTableCellElement
    let key = tableCell.getAttribute('data-col')
    const value = tableCell.innerText

    // Update row with updated values      
    if (key && key in row)
      //@ts-ignore
      row[key] = value
  }

  emit('update', row)

}

/**
 * @desc Gets row, creates a non-window object, and emits it
 * @param row Data values from a row
 */
function deleteRow(row: Object) {
  // Copy all values to temporary object
  const temp = {}
  for (const key in row) {
    //@ts-ignore
    temp[key] = row[key]
  }

  emit('delete', temp)
}

</script>

<style scoped>
.table {
  width: 100%;
  margin-bottom: 1rem;
  color: #212529;
  vertical-align: top;
  border-color: #dee2e6;
  font-size: 90%;
  text-align: center;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>