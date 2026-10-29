<script setup lang="ts">
import type { AvSelectModelValue, AvSelectOption, AvSelectProps } from '@avenirs-esr/avenirs-dsav'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { EActivityThematic } from '@/api/avenir-esr'
import { isEnumMember } from '@/common/utils'

export interface ActivityThematicSelectProps extends Omit<AvSelectProps, 'options' | 'placeholder' | 'label'> {
  thematics?: EActivityThematic[]
}

const {
  thematics,
  ...restProps
} = defineProps<ActivityThematicSelectProps>()

const selectedThematics = defineModel<EActivityThematic | EActivityThematic[]>()

const { t } = useI18n()

const options = computed<AvSelectOption[]>(() =>
  Object.values(EActivityThematic)
    .filter(thematic => !thematics?.length || thematics.includes(thematic))
    .map(thematic => ({
      value: thematic,
      label: t(`global.activities.badges.thematics.${thematic}`),
    }))
)

function toOption (thematic?: EActivityThematic): AvSelectOption | null {
  return options.value.find(option => option.value === thematic) ?? null
}

function toThematic (option?: AvSelectOption | null): EActivityThematic | undefined {
  if (!option) {
    return undefined
  }

  const value = String(option?.value)
  return isEnumMember(EActivityThematic, value)
    ? value
    : undefined
}

const selectedOption = computed<AvSelectModelValue>({
  get: () => Array.isArray(selectedThematics.value)
    ? selectedThematics.value.flatMap(thematic => toOption(thematic) ?? [])
    : toOption(selectedThematics.value),
  set: newValue => selectedThematics.value = Array.isArray(newValue)
    ? newValue.flatMap(option => toThematic(option) ?? [])
    : toThematic(newValue)
})

const avSelectProps = computed<AvSelectProps>(() => ({
  ...restProps,
  label: t('global.activities.inputs.ActivityThematicSelect.label'),
  placeholder: t(`global.activities.inputs.ActivityThematicSelect.placeholder.${restProps.multiple ? 'multiple' : 'single'}`),
  options: options.value,
  width: 'var(--dimension-7xl)',
}))
</script>

<template>
  <AvSelect
    v-bind="avSelectProps"
    v-model="selectedOption"
  />
</template>
