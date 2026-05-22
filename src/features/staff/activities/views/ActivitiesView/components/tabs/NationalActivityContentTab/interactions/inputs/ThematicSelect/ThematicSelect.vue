<script setup lang="ts">
import { EActivityThematic } from '@/api/avenir-esr'
import { AvSelect, type AvSelectProps, MDI_ICONS, } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

type ThematicSelectProps = Omit<AvSelectProps, 'options' | 'placeholder' | 'prefixIcon'>

const { label, ...restProps } = defineProps<ThematicSelectProps>()
const selectedItem = defineModel<{ itemId: EActivityThematic }>()
const { t } = useI18n()
const options = computed(() =>
  Object.values(EActivityThematic).map(thematic => ({
    id: thematic,
    label: t(`global.activities.badges.thematics.${thematic}`),
  })),
)

const avSelectProps = computed<AvSelectProps>(() => ({
  ...restProps,
  label:
    label
    ?? t('staff.activities.interactions.inputs.ThematicSelect.label',),
  placeholder: t('staff.activities.interactions.inputs.ThematicSelect.placeholder',),
  prefixIcon: MDI_ICONS.BOOK_OPEN_VARIANT,
  options: options.value,
}))
</script>

<template>
  <AvSelect
    v-bind="avSelectProps"
    v-model:selected-item="selectedItem"
  />
</template>
