<script setup lang="ts">
import { useSingletonArray } from '@/common/composables/use-singleton-array/use-single-array'
import { TRACE_ACCEPTED_FILE_TYPES } from '@/features/traces/components/interactions/inputs/TraceFileUpload/types'
import { AvFileUpload, type AvFileUploadProps } from '@avenirs-esr/avenirs-dsav'
import { useAttrs } from 'vue'
import { useI18n } from 'vue-i18n'

interface TraceFileUploadProps extends Omit<AvFileUploadProps, 'title' | 'description' | 'ariaLabel' | 'accept' | 'deleteButtonLabel' | 'modelValue'> {
  title?: string
  description?: string
  accept?: string[]
  deleteButtonLabel?: string
  label?: string
}

const {
  title = undefined,
  description = undefined,
  accept = [...TRACE_ACCEPTED_FILE_TYPES],
  deleteButtonLabel = undefined,
  disabled = false,
  ...restProps
} = defineProps<TraceFileUploadProps>()

const modelValue = defineModel<File | null>({
  required: true
})

const files = useSingletonArray(modelValue)

const { t } = useI18n()
const attrs = useAttrs()

const filesTypesMaxSize = [
  { type: 'global.images', size: '5Mo' },
  { type: 'global.text', size: '5Mo' },
  { type: 'global.audio', size: '5Mo' },
  { type: 'global.video', size: '10Mo' },
  { type: 'global.application', size: '10Mo' }
]

const avFileUploadProps = computed<AvFileUploadProps>(() => ({
  ...attrs,
  ...restProps,
  accept,
  disabled,
  title: title ?? t('global.information.fileUpload.title'),
  ariaLabel: title ?? t('global.information.fileUpload.title'),
  description: description ?? t('global.information.fileUpload.dragAndDrop'),
  deleteButtonLabel: deleteButtonLabel ?? t('global.buttons.delete')
}))
</script>

<template>
  <div class="trace-file-upload">
    <div
      v-if="label"
      class="av-pb-xxs"
      data-testid="trace-file-upload__label"
    >
      <span class="b2-light av-text-text1">
        {{ label }}
      </span>
    </div>
    <AvFileUpload
      v-bind="avFileUploadProps"
      v-model="files"
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
