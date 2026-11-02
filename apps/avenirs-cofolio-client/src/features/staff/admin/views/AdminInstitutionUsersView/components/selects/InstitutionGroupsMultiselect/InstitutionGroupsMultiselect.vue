<script setup lang="ts">
import type { AvSelectModelValue, AvSelectProps } from '@avenirs-esr/avenirs-dsav'
import type { GetGroupsParams } from '@/api/avenir-esr'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { useGetGroups } from '@/api/avenir-esr'
import QuerySuspense from '@/common/components/feedback/QuerySuspense/QuerySuspense.vue'

const selectedGroups = defineModel<string[]>({ default: () => [] })

const { t } = useI18n()

const selectedOptions = ref<AvSelectModelValue>(null)

const pageSizeRef = ref(100)

const params = computed<GetGroupsParams>(() => ({
  pageSize: pageSizeRef.value
}))

const { data, isPending, error } = useGetGroups(params.value)

const groups = computed(() => data.value?.data ?? [])
const totalElements = computed(() => data.value?.page?.totalElements ?? 0)

const options = computed(() => [
  ...(groups.value).map(group => ({
    value: group.id,
    label: group.name,
  })),
])

const avSelectProps = computed<AvSelectProps>(() => ({
  label: t('staff.admin.views.AdminInstitutionUsersView.components.selects.InstitutionGroupsMultiselect.label'),
  placeholder: t('staff.admin.views.AdminInstitutionUsersView.components.selects.InstitutionGroupsMultiselect.placeholder'),
  search: true,
  searchPlaceholder: t('staff.admin.views.AdminInstitutionUsersView.components.selects.InstitutionGroupsMultiselect.searchPlaceholder'),
  options: options.value,
  disabled: !data.value?.data?.length,
  labelVisible: true,
  required: true,
  dense: true,
  height: '2.5rem',
  collapseMaxHeight: '35vh',
  multiple: true,
  width: 'var(--dimension-8xl)'
}))

function updateSelectedOptions (event: AvSelectModelValue) {
  selectedOptions.value = event
  selectedGroups.value = (Array.isArray(event) ? event : [event]).map(option => String(option?.value))
}

watch(totalElements, () => {
  if (totalElements.value > pageSizeRef.value) {
    pageSizeRef.value = totalElements.value
  }
})
</script>

<template>
  <div>
    <QuerySuspense
      :is-loading="isPending"
      :error="error"
    >
      <AvSelect
        v-bind="avSelectProps"
        :model-value="selectedOptions"
        data-testid="institution-groups-multiselect"
        @update:model-value="updateSelectedOptions"
      />
    </QuerySuspense>
  </div>
</template>
