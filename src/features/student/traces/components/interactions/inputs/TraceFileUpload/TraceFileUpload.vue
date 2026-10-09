<script setup lang="ts">
import { useFileValidation } from '@/common/composables/use-file-validation/use-file-validation'
import { useSingletonArray } from '@/common/composables/use-singleton-array/use-singleton-array'
import { bytesToMegabytes } from '@/common/utils/file/file'
import { TRACE_ACCEPTED_FILE_TYPES } from '@/features/student/traces/components/interactions/inputs/TraceFileUpload/types'
import { TRACE_MAX_SIZE_BYTES } from '@/features/student/traces/config'
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

const { t } = useI18n()
const attrs = useAttrs()

const files = useSingletonArray(modelValue)
const { getMaxSizeForFile } = useFileValidation({
  acceptedFileTypes: accept,
  maxSizeConfig: TRACE_MAX_SIZE_BYTES
})

function getMaxSizeMb (file: File) {
  const bytes = getMaxSizeForFile(file)
  return bytes ? bytesToMegabytes(bytes) : undefined
}

const filesTypesMaxSize = computed(() => [
  { type: 'global.images', fileType: 'image/*' },
  { type: 'global.text', fileType: 'text/*' },
  { type: 'global.audio', fileType: 'audio/*' },
  { type: 'global.video', fileType: 'video/*' },
  { type: 'global.application', fileType: 'application/*' }
].map(item => ({
  ...item,
  size: `${bytesToMegabytes(TRACE_MAX_SIZE_BYTES[item.fileType]!)}${t('global.megabyteUnit')}`
})))

const acceptTypeError = ref<string | null>(null)
const fileSizeError = ref<string | null>(null)
const maxFilesError = ref<string | null>(null)

function handleAcceptTypeError () {
  acceptTypeError.value = t('global.error.file.acceptType')
}

function handleFileSizeError () {
  fileSizeError.value = t('global.error.file.size')
}

function handleMaxFilesError () {
  maxFilesError.value = t('global.error.file.maxFiles')
}

const errors = computed(() => {
  return [
    restProps.error,
    acceptTypeError.value,
    fileSizeError.value,
    maxFilesError.value
  ].filter(Boolean).join(' ')
})

const avFileUploadProps = computed<AvFileUploadProps>(() => ({
  ...attrs,
  ...restProps,
  accept,
  disabled,
  error: errors.value,
  title: title ?? t('global.information.fileUpload.title'),
  ariaLabel: title ?? t('global.information.fileUpload.title'),
  description: description ?? t('global.information.fileUpload.dragAndDrop'),
  deleteButtonLabel: deleteButtonLabel ?? t('global.buttons.delete')
}))

function onFilesUpdate (newFiles: File[] | null) {
  acceptTypeError.value = null
  fileSizeError.value = null
  maxFilesError.value = null
  files.value = newFiles ?? []
}
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
      :model-value="files"
      :max-file-size-mb="getMaxSizeMb"
      @update:model-value="onFilesUpdate"
      @file-size-error="handleFileSizeError"
      @accept-type-error="handleAcceptTypeError"
      @max-files-error="handleMaxFilesError"
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
