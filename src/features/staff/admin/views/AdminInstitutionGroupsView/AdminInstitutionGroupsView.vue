<script setup lang="ts">
import type { EGroupType } from '@/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import SearchEntityInput from '@/common/components/interaction/inputs/SearchEntityInput/SearchEntityInput.vue'
import PageTitle from '@/common/components/navigation/PageTitle/PageTitle.vue'
import GroupsList from '@/features/staff/admin/components/dataDisplay/GroupsList/GroupsList.vue'
import GroupTypeMultiselect from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/selects/GroupTypeMultiselect/GroupTypeMultiselect.vue'

const { t } = useI18n()

const keyword = ref<string | undefined>(undefined)
const typesSelected = ref<EGroupType[]>([])
</script>

<template>
  <PageTitle :title="t('staff.admin.views.AdminInstitutionGroupsView.title')" />

  <div class="av-col av-gap-sm">
    <div class="av-row av-wrap av-align-center av-gap-md">
      <SearchEntityInput
        v-model="keyword"
        :entity-name="t('staff.admin.views.AdminInstitutionGroupsView.components.inputs.SearchEntityInput.label')"
        :entity-placeholder="t('staff.admin.views.AdminInstitutionGroupsView.components.inputs.SearchEntityInput.placeholder')"
      />
      <GroupTypeMultiselect v-model="typesSelected" />
    </div>
    <GroupsList
      :keyword="keyword"
      :types="typesSelected"
    />
  </div>
</template>
