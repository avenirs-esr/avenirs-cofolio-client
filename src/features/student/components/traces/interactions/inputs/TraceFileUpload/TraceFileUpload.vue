<script setup lang="ts">
import { TRACE_ACCEPTED_FILE_TYPES } from '@/features/student/components/traces/interactions/inputs/TraceFileUpload/types'
import { AvFileUpload, type AvFileUploadProps } from '@avenirs-esr/avenirs-dsav'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

interface TraceFileUploadProps extends Omit<AvFileUploadProps, 'title' | 'description' | 'ariaLabel' | 'accept' | 'deleteButtonLabel'> {
  title?: string
  description?: string
  accept?: string[]
  deleteButtonLabel?: string
  label?: string
}

const props = withDefaults(defineProps<TraceFileUploadProps>(), {
  title: undefined,
  description: undefined,
  accept: () => [...TRACE_ACCEPTED_FILE_TYPES],
  deleteButtonLabel: undefined,
  disabled: false
})

const modelValue = defineModel<File | null>({
  required: true
})

const { t } = useI18n()
const attrs = useAttrs()

const filesTypesMaxSize = [
  { type: 'global.images', size: '5Mo' },
  { type: 'global.text', size: '5Mo' },
  { type: 'global.audio', size: '5Mo' },
  { type: 'global.video', size: '10Mo' },
  { type: 'global.application', size: '10Mo' }
]

const avFileUploadProps = computed(() => ({
  ...attrs,
  ...props,
  title: props.title ?? t('global.information.fileUpload.title'),
  ariaLabel: props.title ?? t('global.information.fileUpload.title'),
  description: props.description ?? t('global.information.fileUpload.dragAndDrop'),
  deleteButtonLabel: props.deleteButtonLabel ?? t('global.buttons.delete')
}))
</script>

<template>
  <div class="trace-file-upload">
    <div
      v-if="label"
      class="trace-file-upload__label"
    >
      <span class="b2-light">
        {{ label }}
      </span>
    </div>
    <AvFileUpload
      v-bind="avFileUploadProps"
      v-model="modelValue"
    />
    <div>
      <span
        v-for="(item, index) in filesTypesMaxSize"
        :key="item.type"
        class="caption-light"
      >
        {{ t(item.type) }} : <span class="caption-bold">{{ item.size }}</span>
        <span v-if="index < filesTypesMaxSize.length - 1"> • </span>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.trace-file-upload {

  &__label {
    padding-bottom: var(--spacing-xxs);
  }

  .b2-light {
    color: var(--text1);
  }
}
</style>
