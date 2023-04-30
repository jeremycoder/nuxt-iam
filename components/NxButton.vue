<template>
  <button class="nx-button nx-px-4" :class="[
      themeClass,
      sizeClass,
      disabledClass,
      hoverClass,
    ]" :disabled="!isActive" @click="buttonClicked">
    <slot />
  </button>
</template>

<script setup lang="ts">
const emit = defineEmits(['click'])



const props = defineProps({
  state: {
    validator(value: string) {
      return ['active', 'disabled'].includes(value)
    },
    default: 'active',
  },
  theme: {
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
  size: {
    validator(value: string) {
      return ['x-small', 'small', 'medium', 'large', 'x-large'].includes(value)
    },
    default: 'medium',
  }
})

const themeClasses = [
  {
    name: 'primary',
    class: 'nx-primary'
  },
  {
    name: 'primary-outline',
    class: 'nx-primary-outline'
  },
  {
    name: 'secondary',
    class: 'nx-secondary'
  },
  {
    name: 'secondary-outline',
    class: 'nx-secondary-outline'
  },
  {
    name: 'success',
    class: 'nx-success'
  },
  {
    name: 'success-outline',
    class: 'nx-success-outline'
  },
  {
    name: 'info',
    class: 'nx-info'
  },
  {
    name: 'info-outline',
    class: 'nx-info-outline'
  },
  {
    name: 'warning',
    class: 'nx-warning'
  },
  {
    name: 'warning-outline',
    class: 'nx-warning-outline'
  },
  {
    name: 'danger',
    class: 'nx-danger'
  },
  {
    name: 'danger-outline',
    class: 'nx-danger-outline'
  },
  {
    name: 'light',
    class: 'nx-light'
  },
  {
    name: 'light-outline',
    class: 'nx-light-outline'
  },
  {
    name: 'dark',
    class: 'nx-dark'
  },
  {
    name: 'dark-outline',
    class: 'nx-dark-outline'
  },
  {
    name: 'link',
    class: 'nx-link'
  },
]

const sizeClasses = [
  {
    name: 'small',
    class: 'nx-button-small'
  },
  {
    name: 'large',
    class: 'nx-button-large'
  }
]

const hoverClasses = [
  {
    name: 'primary',
    class: 'nx-primary:hover'
  },
  {
    name: 'secondary',
    class: 'nx-secondary:hover'
  },
  {
    name: 'info',
    class: 'nx-info:hover'
  },
  {
    name: 'success',
    class: 'nx-success:hover'
  },
  {
    name: 'warning',
    class: 'nx-warning:hover'
  },
  {
    name: 'danger',
    class: 'nx-danger:hover'
  },
  {
    name: 'light',
    class: 'nx-light:hover'
  },
  {
    name: 'dark',
    class: 'nx-dark:hover'
  },
  {
    name: 'primary-outline',
    class: 'nx-primary-outline:hover'
  },
  {
    name: 'secondary-outline',
    class: 'nx-secondary-outline:hover'
  },
  {
    name: 'info-outline',
    class: 'nx-info-outline:hover'
  },
  {
    name: 'success-outline',
    class: 'nx-success-outline:hover'
  },
  {
    name: 'warning-outline',
    class: 'nx-warning-outline:hover'
  },
  {
    name: 'danger-outline',
    class: 'nx-danger-outline:hover'
  },
  {
    name: 'light-outline',
    class: 'nx-light-outline:hover'
  },
  {
    name: 'dark-outline',
    class: 'nx-dark-outline:hover'
  },
]

// Computed properties
const isActive = computed(() => {
  return props.state === 'active'
})

const themeClass = computed(() => {
  const theme = themeClasses.find(theme => theme.name === props.theme)
  return theme?.class
})

const sizeClass = computed(() => {
  const size = sizeClasses.find(size => size.name === props.size)
  return size?.class
})

const disabledClass = computed(() => {
  if (!isActive.value) return 'nx-button-disabled'
})

const hoverClass = computed(() => {
  const theme = hoverClasses.find(theme => theme.name === props.theme)
  return theme?.class
})

/**
 * @desc Send event to parent when component is clicked
 */
function buttonClicked() {
  emit('click')
}
</script>

<style scoped>
.nx-button {
  display: inline-block;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: .375rem .75rem;
  font-size: 1rem;
  border-radius: .25rem;
  transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
  padding-right: 1rem !important;
  padding-left: 1rem !important;
}

.nx-primary,
.nx-primary-outline:hover {
  color: #fff;
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.nx-primary-outline {
  color: #0d6efd;
  background-color: #fff;
  border-color: #0d6efd;
}

.nx-secondary,
.nx-secondary-outline:hover {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.nx-secondary-outline {
  background-color: #fff;
  color: #6c757d;
  border-color: #6c757d;
}

.nx-success,
.nx-success-outline:hover {
  color: #fff;
  background-color: #198754;
  border-color: #198754;
}

.nx-success-outline {
  background-color: #fff;
  color: #198754;
  border-color: #198754;
}

.nx-info,
.nx-info-outline:hover {
  color: #000;
  background-color: #0dcaf0;
  border-color: #0dcaf0;
}

.nx-info-outline {
  color: #0dcaf0;
  background-color: #fff;
  border-color: #0dcaf0;
}

.nx-warning,
.nx-warning-outline:hover {
  color: #000;
  background-color: #ffc107;
  border-color: #ffc107;
}

.nx-warning-outline {
  color: #ffc107;
  background-color: #fff;
  border-color: #ffc107;
}

.nx-danger,
.nx-danger-outline:hover {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545;
}

.nx-danger-outline {
  color: #dc3545;
  background-color: #fff;
  border-color: #dc3545;
}

.nx-light,
.nx-light-outline:hover {
  color: #000;
  background-color: #f8f9fa;
  border-color: #f8f9fa;
}

.nx-light-outline {
  color: #f8f9fa;
  background-color: #fff;
  border-color: #f8f9fa;
}

.nx-dark,
.nx-dark-outline:hover {
  color: #fff;
  background-color: #212529;
  border-color: #212529;
}

.nx-dark-outline {
  color: #212529;
  background-color: #fff;
  border-color: #212529;
}

.nx-link {
  color: #0d6efd;
  background-color: transparent;
  border-color: transparent;
}

/* Hover classess */
.nx-primary:hover {
  color: #fff;
  background-color: #0b5ed7;
  border-color: #0a58ca;
}

.nx-secondary:hover {
  color: #fff;
  background-color: #5c636a;
  border-color: #565e64;
}

.nx-info:hover {
  color: #000;
  background-color: #31d2f2;
  border-color: #25cff2;
}

.nx-success:hover {
  color: #fff;
  background-color: #157347;
  border-color: #146c43;
}

.nx-warning:hover {
  color: #000;
  background-color: #ffca2c;
  border-color: #ffc720;
}

.nx-danger:hover {
  color: #fff;
  background-color: #bb2d3b;
  border-color: #b02a37;
}

.nx-light:hover {
  color: #000;
  background-color: #d3d4d5;
  border-color: #c6c7c8;
}

.nx-dark:hover {
  color: #fff;
  background-color: #424649;
  border-color: #373b3e;
}

/* Outlined hover classes */

/* Disabled */
.nx-button-disabled {
  pointer-events: none;
  opacity: 0.65;
}

/* Sizes */
.nx-button-small {
  padding: 0.25em 0.5em;
  font-size: 0.875rem;
  border-radius: 0.25rem;
}

.nx-button-large {
  padding: 0.5em 1em;
  font-size: 1.25rem;
  border-radius: 0.5rem;
}
</style>