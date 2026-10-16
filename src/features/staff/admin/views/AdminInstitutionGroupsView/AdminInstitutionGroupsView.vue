<script setup lang="ts">
import PageTitle from '@/common/components/navigation/PageTitle/PageTitle.vue'
import GroupsList from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/dataDisplay/GroupsList/GroupsList.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <PageTitle :title="t('staff.admin.views.AdminInstitutionGroupsView.title')" />

  <GroupsList />
</template>
