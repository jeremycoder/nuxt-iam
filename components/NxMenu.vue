<template>
  <ul v-if="menu" class="menu" :class="[shadowClass]">
    <li v-for="(item) in props.menu" class="menu-item" :class="[
        borderBottomClass(item),
        showClass(item),
        disabledClass(item),
      ]" @click.stop="clicked(item)">
      {{ item.name }}
      <span v-if="item.children && item.showChildren !== false">
        <span class="arrow" @click="toggleShowChildren(showChildren)">&raquo;</span>
        <nxMenu v-if="showChildren" :menu="item.children" :shadow="shadowOnChildren" />
      </span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { NxLink } from "~~/iam/misc/types";

const props = defineProps({
  menu: Array<NxLink>,
  shadow: {
    type: Boolean,
    default: true
  },
  shadowOnChildren: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(["clicked"])
const showChildren = ref(false)

// If shadow prop is true, return shadow class
const shadowClass = computed(() => {
  if (props.shadow) return 'shadow'
})

/**
 * Receives object of menu item clicked and emits event
 * @param name Name of menu item that was clicked
 */
function clicked(link: NxLink) {
  emit('clicked', link)
}

/**
 * If the link hasBorder property is true, the border-bottom class will be added
 * @param link A Link object
 */
function borderBottomClass(link: NxLink) {
  if (link.hasBorder) return 'border-bottom'
}

/**
 * If the link showClass is false, a hide class will be added
 * @param link A Link object
 */
function showClass(link: NxLink) {
  if (link.show === false) return 'hide'
}

/**
 * If the link disabled is true, a disabled class will be added
 * @param link A Link object
 */
function disabledClass(link: NxLink) {
  if (link.disabled === true) return 'disabled'
}

/**
 * Toggles show children
 * @param value Value of showChildren
 */
function toggleShowChildren(value: boolean) {
  showChildren.value = !value
}
</script>

<style scoped>
.menu {
  z-index: 1000;
  padding: 0 0.5rem;
  font-size: 1rem;
  color: #212529;
  background-color: #fff;
  border-color: rgba(0, 0, 0, 0.175);
  border-radius: 0.375rem;
  border-width: 1px;
  position: absolute;
  min-width: 10rem;
  padding: 0.5rem 0;
  margin: 0;
  font-size: 1rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.175);
  border-radius: 0.375rem;
  cursor: pointer;
  margin-bottom: 1rem;
}

.menu-item {
  padding: 0.5rem 1rem;
}

.shadow {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

a {
  text-decoration: none;
}

.menu-item:hover {
  background-color: #e9ecef;
}

.disabled {
  color: #adb5bd;
  cursor: auto;
}

.border-bottom {
  border-bottom: 1px solid #ccc;
}

.hide {
  display: none;
}

.arrow {
  font-size: 130%;
  margin-left: 0.5em;
  cursor: pointer;
}
</style>