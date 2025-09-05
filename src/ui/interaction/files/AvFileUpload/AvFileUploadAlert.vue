<script setup lang="ts">
import { MDI_ICONS } from '@/ui'
import AvIconText from '@/ui/base/AvIconText/AvIconText.vue'

export interface AvFileUploadAlertProps {
  /**
   * Error message to be displayed in case of upload problem.
   *
   * @default undefined
   */
  error?: string

  /**
   * Message indicating that the uploaded file is valid.
   *
   * @default undefined
   */
  validMessage?: string
}

withDefaults(defineProps<AvFileUploadAlertProps>(), {
  error: undefined,
  validMessage: undefined
})
</script>

<template>
  <div
    v-if="error || validMessage"
    class="messages-group"
    role="alert"
  >
    <AvIconText
      :icon="error ? MDI_ICONS.CLOSE_CIRCLE_OUTLINE : MDI_ICONS.CHECK_CIRCLE_OUTLINE"
      :icon-color="error ? 'var(--dark-background-error)' : 'var(--dark-background-success)'"
      :text="error ? error : validMessage"
      :text-color="error ? 'var(--dark-background-error)' : 'var(--dark-background-success)'"
      typography-class="caption-regular"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
