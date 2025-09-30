<script setup lang="ts">
import { TRACE_ACCEPTED_FILE_TYPES } from '@/features/student/components/inputs'
import { AvFileUpload, type AvFileUploadProps } from '@avenirs-esr/avenirs-dsav'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

interface TraceFileUploadProps extends Omit<AvFileUploadProps, 'title' | 'description' | 'ariaLabel' | 'accept' | 'deleteButtonLabel'> {
  title?: string
  description?: string
  accept?: string[]
  deleteButtonLabel?: string
}

const props = withDefaults(defineProps<TraceFileUploadProps>(), {
  title: undefined,
  description: undefined,
  accept: () => [...TRACE_ACCEPTED_FILE_TYPES],
  deleteButtonLabel: undefined,
  disabled: false
})

const modelValue = defineModel<File | null>()
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
  description: props.description ?? t('global.information.fileUpload.dragAndDrop'),
  deleteButtonLabel: props.deleteButtonLabel ?? t('global.buttons.delete')
}))
</script>

<template>
  <div>
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
