<template>
  <div
    v-if="isOpen"
    class="alert alert-dismissible fade"
    :class="[themeClass]"
    role="alert"
  >
    <slot />
    <span v-if="showClose" @click="isOpen = false" class="cross">
      <svg
        fill="#000000"
        height="17px"
        width="17px"
        class="cross"
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 460.775 460.775"
        xml:space="preserve"
      >
        <path
          d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
                                        c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
                                        c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
                                        c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
                                        l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
                                        c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
        />
      </svg>
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  theme: {
    validator(value: string) {
      return [
        "primary",
        "secondary",
        "success",
        "info",
        "warning",
        "danger",
        "light",
        "dark",
      ].includes(value);
    },
    default: "danger",
  },
  showClose: {
    type: Boolean,
    default: true,
  },
});

const isOpen = ref(true);

const themeClasses = [
  {
    name: "primary",
    class: "alert-primary",
  },
  {
    name: "secondary",
    class: "alert-secondary",
  },
  {
    name: "success",
    class: "alert-success",
  },
  {
    name: "info",
    class: "alert-info",
  },
  {
    name: "warning",
    class: "alert-warning",
  },
  {
    name: "danger",
    class: "alert-danger",
  },
  {
    name: "light",
    class: "alert-light",
  },
  {
    name: "dark",
    class: "alert-dark",
  },
];

const themeClass = computed(() => {
  const theme = themeClasses.find((theme) => theme.name === props.theme);
  return theme?.class;
});
</script>

<style scoped>
.alert {
  position: relative;
  padding: 1rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.fade {
  transition: opacity 0.15s linear;
}

.cross {
  margin-left: 1rem;
}

.cross:hover {
  color: red;
}

.alert-dismissible {
  padding-right: 3rem;
}

.alert-danger {
  color: #842029;
  background-color: #f8d7da;
  border-color: #f5c2c7;
}

.alert-primary {
  color: #084298;
  background-color: #cfe2ff;
  border-color: #b6d4fe;
}

.alert-success {
  color: #0f5132;
  background-color: #d1e7dd;
  border-color: #badbcc;
}

.alert-secondary {
  color: #41464b;
  background-color: #e2e3e5;
  border-color: #d3d6d8;
}

.alert-warning {
  color: #664d03;
  background-color: #fff3cd;
  border-color: #ffecb5;
}

.alert-info {
  color: #055160;
  background-color: #cff4fc;
  border-color: #b6effb;
}

.alert-light {
  color: #636464;
  background-color: #fefefe;
  border-color: #fdfdfe;
}

.alert-dark {
  color: #141619;
  background-color: #d3d3d4;
  border-color: #bcbebf;
}

.cross {
  cursor: pointer;
}
</style>
