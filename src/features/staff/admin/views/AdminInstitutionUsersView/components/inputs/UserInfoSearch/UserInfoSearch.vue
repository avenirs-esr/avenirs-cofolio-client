<script lang="ts" setup>
import Input from '@/common/components/interaction/inputs/Input/Input.vue'
import { useI18n } from 'vue-i18n'

const modelValue = defineModel<string>({ default: '' })

const { t } = useI18n()

function handleModelValueChange (value: string | number | null | undefined) {
  const stringValue = value?.toString() ?? ''
  modelValue.value = stringValue
}
</script>

<template>
  <Input
    :model-value="modelValue"
    :label="t('staff.admin.views.AdminInstitutionUsersView.components.inputs.UserInfoSearch.label')"
    :aria-label="t('staff.admin.views.AdminInstitutionUsersView.components.inputs.UserInfoSearch.label')"
    class="user-info-search-input"
    :placeholder="t('staff.admin.views.AdminInstitutionUsersView.components.inputs.UserInfoSearch.placeholder')"
    width="var(--dimension-8xl)"
    label-visible
    @update:model-value="handleModelValueChange"
  />
</template>
