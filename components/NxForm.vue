<!-- This component displays an object as an input form -->
<template>
  <form class="mb-5" :style="`width: ${width}rem;`">
    <div class="mb-3">
      <div v-for="(item, index) in data" :key="index">
        <label v-if="item.label && item.show !== false" :for="item.label" class="form-label"><strong>{{ item.label }}</strong></label>
        <input v-if="item.type === 'input:text' && item.show !== false" type="text" class="form-control mb-3"
          :id="item.id" :disabled="item.disabled ?? false" :value="item.value ?? ''" @change="updateInputs" />
        <input v-if="item.type === 'input:password' && item.show !== false" type="password" class="form-control mb-3"
          :id="item.id" :disabled="item.disabled ?? false" :value="item.value ?? ''" @change="updateInputs" />
        <input v-if="item.type === 'input:number' && item.show !== false" type="number" class="form-control mb-3"
          :id="item.id" :disabled="item.disabled ?? false" :value="item.value ?? ''" @change="updateInputs" />
        <input v-if="item.type === 'input:email' && item.show !== false" type="email" class="form-control mb-3"
          :id="item.id" :disabled="item.disabled ?? false" :value="item.value ?? ''" @change="updateInputs" />
        <textarea v-if="item.type === 'textarea' && item.show !== false" :id="item.id" :disabled="item.disabled ?? false"
          :value="item.value ?? ''" @change="updateInputs">
        </textarea>
        <span v-if="item.type === 'select' && item.show !== false">
          <select :id="item.id" class="form-control mb-3" :disabled="item.disabled ?? false" :value="item.value ?? ''" @change="updateInputs">
            <option v-for="(option, index) in item.options" :key="index" class="mb-3">{{ option }}</option>
          </select>
        </span>
      </div>
    </div>
    <span @click.prevent="submit">
      <NxButton :theme="buttonTheme">{{ submitText }}</NxButton>
    </span>

  </form>
</template>

<script setup lang="ts">
import { NxFormInput } from "~~/iam/misc/types";

const emit = defineEmits(["submit"]);

const props = defineProps({
  data: {
    type: Array<NxFormInput>,
  },
  width: {
    type: Number,    
    default: 14,
  },
  returnKeys: {
    type: Array<string>,
  },
  submitText: {
    type: String,
    default: 'Submit'
  },
  buttonTheme: {
    validator(value: string) {
      return [
        'primary', 
        'secondary', 
        'success', 
        'info', 
        'warning', 
        'danger', 
        'dark', 
        'light', 
        'link', 
        'primary-outline',
        'success-outline'
      ].includes(value)
    },
    default: 'primary',
  },
})

const updatedInputs = {}

/**
 * @desc Update inputs when the form is updated
 * @param event Change event received from HTML tag
 */
function updateInputs(event: Event) {  
  const targetElement = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  const id = targetElement.getAttribute('id')
  const value = targetElement.value

  /* @ts-ignore */
  if (id && value) updatedInputs[id] = value 
}

/**
 * @desc Process inputs and return submit
 */
function submit() {   
  // If we have return keys, get their values and add to updated inputs 
  if (props.returnKeys?.length && props.data?.length) {
    // Get inputs with keys
    props.returnKeys.forEach((key) => {
      const input = props.data?.find(input => input.id === key)
      /* @ts-ignore */
      if (input) updatedInputs[input.id] = input.value      
    })
  }

  emit('submit', updatedInputs)
}


</script>

<style scoped>
.mb-5 {
  margin-bottom: 3rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

.form-label {
  margin-bottom: 0.5rem;
}

label {
  display: inline-block;
}

.form-control {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  appearance: none;
  border-radius: 0.25rem;
  transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}

select {
  text-transform: none;
}

input:disabled,
select:disabled {
  background-color: #eee;
}
</style>