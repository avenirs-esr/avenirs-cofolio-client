<script setup lang="ts">
import type { Message } from '@/store/toaster/toaster'
import { useToasterStore } from '@/store'
import AvAlert from '@/ui/feedback/AvAlert/AvAlert.vue'
import { storeToRefs } from 'pinia'

const toasterStore = useToasterStore()
const { messages } = storeToRefs(toasterStore)
const { removeMessage } = toasterStore

function getToasterClass (type: Message['type']) {
  if (type) {
    return `av-toaster--${type} av-toaster--icon`
  }
  return ''
}

function getToasterStyleVars (type: Message['type']) {
  switch (type) {
    case 'error':
      return { '--icon-path': 'url(/assets/icons/alert-circle-outline.svg)' }
    case 'info':
      return { '--icon-path': 'url(/assets/icons/message-badge.svg)' }
    case 'success':
      return { '--icon-path': 'url(/assets/icons/check-cricle.svg)' }
    case 'warning':
      return { '--icon-path': 'url(/assets/icons/warning-outline.svg)' }
    default:
      return ''
  }
}
</script>

<template>
  <div class="toaster-container">
    <TransitionGroup
      mode="out-in"
      name="list"
      tag="div"
      class="toasters"
    >
      <AvAlert
        v-for="message in messages"
        :key="message.id"
        class="av-toaster"
        :class="getToasterClass(message.type)"
        v-bind="message"
        :style="getToasterStyleVars(message.type)"
        @close="removeMessage(message.id!)"
      />
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.toaster-container {
  pointer-events: none;
  position: fixed;
  bottom: 1rem;
  width: 100%;
  z-index: 1750;
}
.toasters {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.av-toaster {
  width: 90%;
  pointer-events: all;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-leave-active {
  position: fixed;
}
</style>
