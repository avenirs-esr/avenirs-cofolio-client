<script setup lang="ts">
import { AvToaster } from '@avenirs-esr/avenirs-dsav'
import MainLayout from '@/layouts/MainLayout/MainLayout.vue'
import { useToasterStore } from '@/store'

const toasterStore = useToasterStore()
const { messages } = storeToRefs(toasterStore)
const { removeMessage } = toasterStore
</script>

<template>
  <MainLayout />
  <AvToaster
    :messages="messages"
    :on-remove-message="removeMessage"
  />
</template>
