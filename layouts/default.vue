<template>
  <div class="">
    <nav class="">
      <div class="">
        <ul class="">          
          <li><NuxtLink to="/" class="" aria-current="page"><strong>LOGO</strong></NuxtLink></li>
          <li><NuxtLink to="/" class="" aria-current="page">Home</NuxtLink></li>
          <li class="nav-link px-2 link-dark">
            <span @click="toggleNuxtIamMenu()">Nuxt IAM</span>          
            <iamMenu v-if="showNuxtIamMenu" :menu="nuxtIamMenu" :shadow="false" @clicked="menuClicked" />
          </li>  
          <li><NuxtLink to="/sample-page" class="">Sample Page</NuxtLink></li>  
          <li><NuxtLink to="/protected-page" class="" title="You must be logged in to view this page">Protected Page</NuxtLink></li>  
          <li><NuxtLink to="/contact" class="">Contact</NuxtLink></li>         
        </ul>
        <iamLoginMenu />    
      </div>
    </nav>      
      <iamLoggedInHeader />
      <slot />
 
  </div>
</template>

<script setup lang="ts">
type Link = {
  name: string,
  link?: string,
  disabled?: Boolean,
  show?: Boolean,
  hasBorder?: Boolean,
  showChildren?: Boolean,
  children?: Links
}

type Links = Array<Link>

const nuxtIamMenu = [
  {
    name: 'What is it?',
    link: '/iam/',
  },
  {
    name: 'Introduction',
    link: '/iam/docs',
  },
  {
    name: 'Getting Started',
    link: '/iam/docs/getting-started'
  },
  {
    name: 'Concepts',
    link: '/iam/docs/concepts'
  },
  {
    name: 'Features',
    link: '/iam/docs/features'
  },
  {
    name: 'Front End',
    link: '/iam/docs/frontend'
  },
  {
    name: 'Configuration',
    link: '/iam/docs/configuration'
  },
  {
    name: 'Backend',
    link: '/iam/docs/backend'
  },
  {
    name: 'Files',
    link: '/iam/docs/files'
  }
]

const showMenu = ref(false);

const showNuxtIamMenu = ref(false);

/**
 * @Desc Toggle Nuxt IAM docs menu
 */
 async function toggleDocsMenu() {
  showMenu.value = !showMenu.value;   
}

/**
 * @Desc Toggle Nuxt IAM docs menu
 */
 async function toggleNuxtIamMenu() {
  showNuxtIamMenu.value = !showNuxtIamMenu.value;   
}

/**
 * @desc Receive clicked link from menu and navigate to that link
 * @param event Receive clicked link data
 */
 function menuClicked(menuItem: Link) {
  showNuxtIamMenu.value = false
  navigateTo(menuItem.link)
}

useHead({  
  title: "Nuxt IAM Example Site",
});
</script>

<style scoped>
  .px-2 {
    padding-right: 0.5rem;
    padding-left: 0.5rem;
  }
  .link-dark {
    color: #212529;
  }
  .nav-link {
    display: block;
    padding: 0.5rem 1rem;
    color: #0d6efd;
    text-decoration: none;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out;
  }
</style>
