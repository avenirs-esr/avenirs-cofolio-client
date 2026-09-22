<script setup lang="ts">
import type { EAssociationContextType } from '@/api/avenir-esr'
import { AvSelect, type AvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface AssociationContextTypeSelectProps {
  contextTypes: EAssociationContextType[]
}

const { contextTypes } = defineProps<AssociationContextTypeSelectProps>()

const contextType = defineModel<EAssociationContextType>({ required: true })

const { t } = useI18n()

const selectedItem = computed<AvSelectSelectedOption>({
  get: () => ({ itemId: contextType.value }),
  set: ({ itemId }) => {
    contextType.value = itemId as EAssociationContextType
  }
})

const options = computed(() =>
  contextTypes.map(type => ({
    id: type,
    label: t(`student.associations.contextTypes.${type}.selectionLabel`)
  }))
)
</script>

<template>
  <AvSelect
    v-model:selected-item="selectedItem"
    :options="options"
    :label="t('student.associations.interactions.AssociationContextTypeSelect.label')"
    :placeholder="t('student.associations.interactions.AssociationContextTypeSelect.placeholder')"
  />
</template>
