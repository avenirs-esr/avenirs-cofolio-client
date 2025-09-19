<script setup lang="ts">
import { useToasterStore } from '@/store'
import { AvToaster } from '@avenirs-esr/avenirs-dsav'

const toasterStore = useToasterStore()
const { messages } = storeToRefs(toasterStore)
const { removeMessage } = toasterStore

const basePath = import.meta.env.BASE_URL
</script>

<template>
  <router-view />
  <AvToaster
    :base-path="basePath"
    :messages="messages"
    :on-remove-message="removeMessage"
  />
</template>
