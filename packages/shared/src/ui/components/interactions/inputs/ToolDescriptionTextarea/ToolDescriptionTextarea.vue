<script setup lang="ts">
import type { AvInputProps } from '@avenirs-esr/avenirs-dsav'
import Input from '#shared/ui/components/interactions/inputs/Input/Input.vue'
import { TOOL_DESCRIPTION_MAX_LENGTH } from '#shared/utils/tool.config'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export type ToolDescriptionTextareaProps = Omit<AvInputProps, 'maxlength' | 'isTextarea' | 'label' | 'placeholder' | 'width' | 'textareaMinHeight'>

const {
  disabled,
  ...restProps
} = defineProps<ToolDescriptionTextareaProps>()

const modelValue = defineModel<string>()

const { t } = useI18n()

const i18nKey = 'global.components.interactions.inputs.ToolDescriptionTextarea'

const inputProps = computed(() => ({
  ...restProps,
  disabled,
  width: '100%',
  textareaMinHeight: '14rem',
  isTextarea: true,
  labelVisible: true,
  maxlength: disabled ? undefined : TOOL_DESCRIPTION_MAX_LENGTH,
  label: t(`${i18nKey}.label`),
  placeholder: t(`${i18nKey}.placeholder`),
}))
</script>

<template>
  <Input
    v-bind="inputProps"
    v-model="modelValue"
  />
</template>
