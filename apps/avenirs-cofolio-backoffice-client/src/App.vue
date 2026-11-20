<script setup lang="ts">
import { AvToaster } from '@avenirs-esr/avenirs-dsav'
import { ROUTES } from '@/constants'
import MainLayout from '@/layouts/MainLayout/MainLayout.vue'
import { useToasterStore } from '@/store'

const route = useRoute()
const toasterStore = useToasterStore()
const { messages } = storeToRefs(toasterStore)
const { removeMessage } = toasterStore
</script>

<template>
  <router-view v-if="route.name === ROUTES.FORBIDDEN.name" />
  <MainLayout v-else />
  <AvToaster
    :messages="messages"
    :on-remove-message="removeMessage"
  />
</template>
