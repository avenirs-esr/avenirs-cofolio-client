<script setup lang="ts">
import AvAlert from '@/ui/feedback/AvAlert/AvAlert.vue'

/**
 * Represents a message displayed in the notification system (toaster).
 */
export interface Message {
  /**
   * Unique identifier for the message.
   * Can be used to track or delete the message.
   */
  id?: string

  /**
   * Message title.
   * Optional, displayed in the message header.
   */
  title?: string

  /**
   * Detailed description of the message.
   * This field is required and contains the main text to be displayed.
   */
  description: string

  /**
   * Type of message to display.
   * Defines the style and icon associated with the message.
   *
   * Possible values are:
   * - 'info': General information
   * - 'success': Success message
   * - 'warning': Warning message
   * - 'error': Error message
   */
  type: 'info' | 'success' | 'warning' | 'error'

  /**
   * Indicates whether the message can be manually closed by the user.
   */
  closeable?: boolean

  /**
   * HTML tag used for the message title.
   * Can be used to adjust the semantic hierarchy of the title.
   *
   * Possible values are: 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'.
   */
  titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  /**
   * Time to display the message in milliseconds before automatically closing.
   * If not set, the message will remain displayed until manually closed or another action.
   */
  timeout?: number
}

/**
 * AvToaster component props.
 */
interface AvToasterProps {
  /**
   * List of messages to display in the toaster.
   *
   * Each message must follow the structure defined by the Message interface.
   * - `id?: string`: Unique identifier for the message
   * - `title?: string`: Message title
   * - `description: string`: Detailed description of the message
   * - `type: 'info' \| 'success' \| 'warning' \| 'error'`: Type of message to display
   * - `closeable?: boolean`: Indicates whether the message can be manually closed by the user
   * - `titleTag?: 'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'`: HTML tag used for the message title
   * - `timeout?: number`: Time to display the message in milliseconds before automatically closing (if not set, the message will remain displayed until manually closed or another action)
   */
  messages: Message[]

  /**
   * Function called to remove a message from the toaster.
   * @param id The ID of the message to remove.
   */
  onRemoveMessage: (id: string) => void
}

const { messages, onRemoveMessage } = defineProps<AvToasterProps>()
const basePath = import.meta.env.BASE_URL

function getToasterClass (type: Message['type']) {
  return `av-toaster--${type} av-toaster--icon`
}

function getToasterStyleVars (type: Message['type']) {
  switch (type) {
    case 'error':
      return { '--icon-path': `url(${basePath}assets/icons/alert-circle-outline.svg)` }
    case 'success':
      return { '--icon-path': `url(${basePath}assets/icons/check-cricle.svg)` }
    case 'warning':
      return { '--icon-path': `url(${basePath}assets/icons/warning-outline.svg)` }
    case 'info':
      return { '--icon-path': `url(${basePath}assets/icons/message-badge.svg)` }
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
        @close="onRemoveMessage(message.id!)"
      />
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.toaster-container {
  pointer-events: none;
  position: fixed;
  bottom: var(--spacing-sm);
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
