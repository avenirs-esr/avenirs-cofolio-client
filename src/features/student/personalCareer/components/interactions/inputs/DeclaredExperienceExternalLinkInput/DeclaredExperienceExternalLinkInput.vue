<script setup lang="ts">
import Input, { type InputProps } from '@/common/components/interaction/inputs/Input/Input.vue'
import { DECLARED_EXPERIENCE_EXTERNAL_LINK_MAX_LENGTH } from '@/features/student/personalCareer/config'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

type DeclaredExperienceExternalLinkInputProps = Omit<InputProps, 'maxlength'>

const {
  label,
  prefixIcon,
  placeholder,
  disabled,
  ...restProps
} = defineProps<DeclaredExperienceExternalLinkInputProps>()

const modelValue = defineModel<string>()
const { t } = useI18n()
const resolvedLabel = computed(() =>
  label ?? t('student.personalCareer.interactions.inputs.DeclaredExperienceExternalLinkInput.label')
)
const resolvedIcon = computed(() => prefixIcon ?? MDI_ICONS.LINK)

const inputProps = computed(() => ({
  ...restProps,
  labelVisible: true,
  label: resolvedLabel.value,
  maxlength: DECLARED_EXPERIENCE_EXTERNAL_LINK_MAX_LENGTH,
  prefixIcon: resolvedIcon.value,
  placeholder: placeholder ?? t('student.personalCareer.interactions.inputs.DeclaredExperienceExternalLinkInput.placeholder')
}))
</script>

<template>
  <Input
    v-if="!disabled"
    v-bind="inputProps"
    v-model="modelValue"
  />
  <div
    v-else
    class="av-col"
  >
    <label
      id="experience-link-label"
      class="av-label"
    >
      <span class="b2-light">{{ resolvedLabel }}</span>
    </label>
    <a
      target="_blank"
      rel="noopener noreferrer"
      :href="modelValue"
      class="experience-link"
      aria-labelledby="experience-link-label"
    >
      {{ modelValue }}
    </a>
  </div>
</template>

<style lang="scss" scoped>
.experience-link {
  color: revert;
}
</style>
