<script setup lang="ts">
import type { EUserCategory } from '@avenirs-esr/shared/api/avenir-esr'
import { PageTitle } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import UsersList from '@/features/staff/admin/components/dataDisplay/UsersList/UsersList.vue'
import InstitutionGroupsMultiselect from '@/features/staff/admin/views/AdminInstitutionUsersView/components/selects/InstitutionGroupsMultiselect/InstitutionGroupsMultiselect.vue'
import UserCategoriesMultiselect from '@/features/staff/admin/views/AdminInstitutionUsersView/components/selects/UserCategoriesMultiselect/UserCategoriesMultiselect.vue'

const { t } = useI18n()

const selectedCategories = ref<EUserCategory[]>([])

const selectedGroups = ref<string[]>([])
</script>

<template>
  <PageTitle :title="t('staff.admin.views.AdminInstitutionUsersView.title')" />

  <div class="av-col av-gap-sm">
    <UsersList
      :categories="selectedCategories"
      :group-ids="selectedGroups"
    >
      <InstitutionGroupsMultiselect v-model="selectedGroups" />
      <UserCategoriesMultiselect v-model="selectedCategories" />
    </UsersList>
  </div>
</template>
