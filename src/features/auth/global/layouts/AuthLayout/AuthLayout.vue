<script setup lang="ts">
import Footer from '@/common/components/Footer/Footer.vue'
import { ROUTES } from '@/common/constants'
</script>

<template>
  <main>
    <div class="av-container av-mt-md">
      <router-view />
    </div>
  </main>

  <Footer
    :accessibility-link="ROUTES.AUTH.ACCESSIBILITY"
    :cookies-link="ROUTES.AUTH.COOKIES"
    :legal-link="ROUTES.AUTH.LEGAL"
    :personal-data-link="ROUTES.AUTH.PERSONAL_DATA"
  />
</template>
