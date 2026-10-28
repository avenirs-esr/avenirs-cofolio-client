<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SearchEntityInput from '@/common/components/interaction/inputs/SearchEntityInput/SearchEntityInput.vue'
import PageTitle from '@/common/components/navigation/PageTitle/PageTitle.vue'
import UsersList from '@/features/staff/admin/components/dataDisplay/UsersList/UsersList.vue'
import InstitutionGroupsMultiselect from '@/features/staff/admin/views/AdminInstitutionUsersView/components/selects/InstitutionGroupsMultiselect/InstitutionGroupsMultiselect.vue'

const { t } = useI18n()

const keyword = ref<string | undefined>(undefined)
const selectedGroups = ref<string[]>([])
</script>

<template>
  <PageTitle :title="t('staff.admin.views.AdminInstitutionUsersView.title')" />

  <div class="av-col av-gap-sm">
    <div class="av-row av-wrap av-align-center av-gap-md">
      <SearchEntityInput
        v-model="keyword"
        :entity-name="t('staff.admin.views.AdminInstitutionUsersView.components.inputs.SearchEntityInput.entityName')"
        :entity-placeholder="t('staff.admin.views.AdminInstitutionUsersView.components.inputs.SearchEntityInput.entityPlaceholder')"
      />
      <InstitutionGroupsMultiselect v-model="selectedGroups" />
    </div>
    <UsersList
      :keyword="keyword"
      :group-ids="selectedGroups"
    />
  </div>
</template>
