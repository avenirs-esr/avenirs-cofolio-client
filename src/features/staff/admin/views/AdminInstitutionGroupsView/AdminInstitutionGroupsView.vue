<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SearchEntityInput from '@/common/components/interaction/inputs/SearchEntityInput/SearchEntityInput.vue'
import PageTitle from '@/common/components/navigation/PageTitle/PageTitle.vue'
import GroupsList from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/dataDisplay/GroupsList/GroupsList.vue'

const { t } = useI18n()

const keyword = ref<string | undefined>(undefined)
</script>

<template>
  <PageTitle :title="t('staff.admin.views.AdminInstitutionGroupsView.title')" />

  <div class="av-col av-gap-sm">
    <SearchEntityInput
      v-model="keyword"
      :entity-name="t('staff.admin.views.AdminInstitutionGroupsView.components.inputs.SearchEntityInput.label')"
      :entity-placeholder="t('staff.admin.views.AdminInstitutionGroupsView.components.inputs.SearchEntityInput.placeholder')"
    />
    <GroupsList :keyword="keyword" />
  </div>
</template>
