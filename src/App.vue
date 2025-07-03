<script setup lang="ts">
import { useToasterStore } from '@/store'
import { AvToaster } from '@/ui'

const toasterStore = useToasterStore()
const { messages } = storeToRefs(toasterStore)
const { removeMessage } = toasterStore
</script>

<template>
  <router-view />
  <AvToaster
    :messages="messages"
    :on-remove-message="removeMessage"
  />
</template>
