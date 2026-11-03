<script setup lang="ts">
import { PageTitle } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import UsersList from '@/features/staff/admin/components/dataDisplay/UsersList/UsersList.vue'
import InstitutionGroupsMultiselect from '@/features/staff/admin/views/AdminInstitutionUsersView/components/selects/InstitutionGroupsMultiselect/InstitutionGroupsMultiselect.vue'

const { t } = useI18n()

const selectedGroups = ref<string[]>([])
</script>

<template>
  <PageTitle :title="t('staff.admin.views.AdminInstitutionUsersView.title')" />

  <div class="av-col av-gap-sm">
    <UsersList :group-ids="selectedGroups">
      <InstitutionGroupsMultiselect v-model="selectedGroups" />
    </UsersList>
  </div>
</template>
