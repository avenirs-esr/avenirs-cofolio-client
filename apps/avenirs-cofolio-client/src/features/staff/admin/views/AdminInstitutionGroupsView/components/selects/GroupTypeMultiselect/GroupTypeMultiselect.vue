<script lang="ts" setup>
import type { AvSelectItem, AvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { EGroupType } from '@/api/avenir-esr'
import { useGroupTypeConfig } from '@/features/staff/admin/composables/use-group-type-config/use-group-type-config'

const { t } = useI18n()

const typesSelected = defineModel<EGroupType[]>({ default: () => [] })
const typesSelectedRef = ref<AvSelectSelectedOption[]>([])

const { getGroupTypeConfig } = useGroupTypeConfig()

const typesOptions = computed<AvSelectItem[]>(() => [
  EGroupType.PROGRAM,
  EGroupType.PROGRAM_OPTION,
  EGroupType.STUDENT_GROUP
].map((type) => {
  const { label, icon } = getGroupTypeConfig(type)
  return {
    value: type,
    label: label.value,
    icon: icon.value
  }
}))

watch(typesSelectedRef, (newVal) => {
  typesSelected.value = newVal.map(option => option.value as EGroupType)
}, { immediate: true })
</script>

<template>
  <AvSelect
    v-model="typesSelectedRef"
    class="group-type-multiselect"
    :options="typesOptions"
    :label="t('staff.admin.views.AdminInstitutionGroupsView.components.selects.GroupTypeMultiselect.label')"
    :placeholder="t('staff.admin.views.AdminInstitutionGroupsView.components.selects.GroupTypeMultiselect.placeholder')"
    dense
    width="var(--dimension-7xl)"
    height="2.5rem"
    multiple
    data-testid="group-type-multiselect"
  />
</template>
