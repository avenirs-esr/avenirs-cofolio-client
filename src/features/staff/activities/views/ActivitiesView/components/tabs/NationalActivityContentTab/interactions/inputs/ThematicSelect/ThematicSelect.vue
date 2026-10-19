<script setup lang="ts">
import type { AvSelectOption, AvSelectProps, AvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
import { AvSelect, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { EActivityThematic } from '@/api/avenir-esr'

interface ThematicSelectProps extends Omit<AvSelectProps, 'options' | 'placeholder' | 'prefixIcon' | 'label'> {}

const { ...restProps } = defineProps<ThematicSelectProps>()

const selectedItem = defineModel<{ itemId: EActivityThematic }>()

const { t } = useI18n()

const options = computed<AvSelectOption[]>(() =>
  Object.values(EActivityThematic).map(thematic => ({
    value: thematic,
    label: t(`global.activities.badges.thematics.${thematic}`),
  })),
)

const selectedOption = computed<AvSelectSelectedOption | null>({
  get () {
    const thematic = selectedItem.value

    if (!thematic) {
      return null
    }

    return options.value.find(option => String(option.value) === thematic.itemId) ?? null
  },
  set (option) {
    if (option) {
      selectedItem.value = {
        itemId: option.value as EActivityThematic,
      }
    }
  },
})

const avSelectProps = computed<AvSelectProps>(() => ({
  ...restProps,
  label: t('staff.activities.interactions.ThematicSelect.label'),
  placeholder: t('staff.activities.interactions.ThematicSelect.placeholder',),
  prefixIcon: MDI_ICONS.BOOK_OPEN_VARIANT,
  options: options.value,
  required: true,
  width: 'var(--dimension-7xl)',
}))
</script>

<template>
  <AvSelect
    v-bind="avSelectProps"
    :model-value="selectedOption"
    @update:model-value="(option) => { selectedOption = option as AvSelectSelectedOption | null }"
  />
</template>
