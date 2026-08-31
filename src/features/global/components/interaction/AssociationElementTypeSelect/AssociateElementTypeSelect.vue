<script setup lang="ts">
import type { AssociateElementTypeConfig } from '@/features/traces/types/traces.types'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const {
  typeConfigs,
  isSubType = false
} = defineProps<{
  typeConfigs: AssociateElementTypeConfig[]
  isSubType?: boolean
}>()

const activeTypeKey = defineModel<string>('activeTypeKey', { required: true })

const { t } = useI18n()

const selectedTypeItem = computed({
  get: () => ({ itemId: activeTypeKey.value }),
  set: (val: { itemId: string }) => {
    activeTypeKey.value = val.itemId
  }
})

const typeSelectOptions = computed(() =>
  typeConfigs.map(config => ({
    id: config.key,
    label: config.label
  }))
)
</script>

<template>
  <AvSelect
    v-model:selected-item="selectedTypeItem"
    :options="typeSelectOptions"
    :label="t(`student.global.interaction.inputs.AssociateElementTypeSelect.label.${isSubType ? 'subType' : 'default'}`)"
    :label-visible="!isSubType"
    :placeholder="t('student.global.interaction.inputs.AssociateElementTypeSelect.placeholder')"
  />
</template>
