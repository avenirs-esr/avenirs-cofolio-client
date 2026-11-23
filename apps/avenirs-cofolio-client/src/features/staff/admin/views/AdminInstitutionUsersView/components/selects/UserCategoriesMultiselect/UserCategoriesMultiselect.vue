<script setup lang="ts">
import type { AvSelectModelValue, AvSelectProps } from 'node_modules/@avenirs-esr/avenirs-dsav/dist'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { EUserCategory } from '@avenirs-esr/shared/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import { useUserCategoryConfig } from '@/features/staff/admin/composables/use-user-category-config/use-user-category-config'

const selectedCategories = defineModel<EUserCategory[]>({ default: () => [] })

const { t } = useI18n()

const { getUserCategoryConfig } = useUserCategoryConfig()

const selectedOptions = ref<AvSelectModelValue>(null)

const options = computed(() =>
  Object.values(EUserCategory).map(category => ({
    value: category,
    label: getUserCategoryConfig(category).label.value,
  })),
)

const avSelectProps = computed<AvSelectProps>(() => ({
  label: t('staff.admin.views.AdminInstitutionUsersView.components.selects.UserCategoriesMultiselect.label'),
  placeholder: t('staff.admin.views.AdminInstitutionUsersView.components.selects.UserCategoriesMultiselect.placeholder'),
  options: options.value,
  labelVisible: true,
  dense: true,
  height: '2.5rem',
  collapseMaxHeight: '35vh',
  multiple: true,
  width: 'var(--dimension-8xl)',
}))

function updateSelectedOptions (event: AvSelectModelValue) {
  selectedOptions.value = event
  selectedCategories.value = (Array.isArray(event) ? event : [event])
    .map(option => option?.value as EUserCategory)
}
</script>

<template>
  <AvSelect
    v-bind="avSelectProps"
    :model-value="selectedOptions"
    data-testid="user-categories-multiselect"
    @update:model-value="updateSelectedOptions"
  />
</template>
