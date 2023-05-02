<template>
  <div>  
    <NxNavbar :menu="mainMenu" @clicked="menuClicked"/>   
    <iamLoginMenu />          
    <iamLoggedInHeader />
    <slot /> 
  </div>
</template>

<script setup lang="ts">
import { NxLink, NxLinks } from "~~/iam/misc/types";

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
] as NxLinks

const mainMenu = [
  {
    name: 'LOGO',
    bold: true,
  },
  {
    name: 'Home',
    link: '/',
  },
  {
    name: 'Nuxt IAM',
    children: nuxtIamMenu,
  },
  {
    name: 'Sample',
    link: '/sample',
  },
  {
    name: 'Protected Page',
    link: '/protected',
  },
  {
    name: 'Contact',
    link: '/contact',
  }
] as NxLinks


/**
 * @desc Receive clicked link from menu and navigate to that link
 * @param event Receive clicked link data
 */
 function menuClicked(menuItem: NxLink) {  
  if (menuItem.link) navigateTo(menuItem.link)
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
