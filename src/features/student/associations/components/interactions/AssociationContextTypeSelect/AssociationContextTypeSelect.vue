<script setup lang="ts">
import type { AvSelectOption, AvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
import type { EAssociationContextType } from '@/api/avenir-esr'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AssociationContextTypeSelectProps {
  contextTypes: EAssociationContextType[]
}

const { contextTypes } = defineProps<AssociationContextTypeSelectProps>()

const contextType = defineModel<EAssociationContextType>({ required: true })

const { t } = useI18n()

const options = computed<AvSelectOption[]>(() =>
  contextTypes.map(type => ({
    value: type,
    label: t(`student.associations.contextTypes.${type}.selectionLabel`),
  })),
)

const selectedOption = computed<AvSelectSelectedOption | null>({
  get: () => options.value.find(option => option.value === contextType.value) ?? null,
  set: (option) => {
    if (option) {
      contextType.value = option.value as EAssociationContextType
    }
  },
})
</script>

<template>
  <AvSelect
    v-model="selectedOption"
    :options="options"
    :label="t('student.associations.interactions.AssociationContextTypeSelect.label')"
    :placeholder="t('student.associations.interactions.AssociationContextTypeSelect.placeholder')"
    required
    width="100%"
  />
</template>
