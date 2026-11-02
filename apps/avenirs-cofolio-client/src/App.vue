<script setup lang="ts">
import { AvToaster } from '@avenirs-esr/avenirs-dsav'
import { useToasterStore } from '@/store'

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

<style lang="scss">
.loader {
  .av-icon {
    filter: drop-shadow(0 0 2px var(--other-background-base));
  }
}
</style>
