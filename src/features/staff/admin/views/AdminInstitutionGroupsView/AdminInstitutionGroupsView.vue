<script setup lang="ts">
import type { GroupOverviewDTO } from '@/api/avenir-esr'
import { useI18n } from 'vue-i18n'
import { EGroupType } from '@/api/avenir-esr'
import PageTitle from '@/common/components/navigation/PageTitle/PageTitle.vue'
import GroupsList from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/dataDisplay/GroupsList/GroupsList.vue'

const { t } = useI18n()

// TODO: US#3028
const mockGroups: GroupOverviewDTO[] = [
  {
    id: '1',
    name: 'Groupe avec un nom excessivement long juste pour tester le rendu dans le tableau',
    type: EGroupType.PROGRAM,
    usersCount: 10
  },
  {
    id: '2',
    name: 'Group 2',
    type: EGroupType.PROGRAM_OPTION,
    usersCount: 5
  },
  {
    id: '3',
    name: 'Group 3',
    type: EGroupType.STUDENT_GROUP,
    usersCount: 8,
    parentId: '1',
    parentName: 'Groupe avec un nom excessivement long juste pour tester le rendu dans le tableau'
  }
]
</script>

<template>
  <PageTitle :title="t('staff.admin.views.AdminInstitutionGroupsView.title')" />

  <GroupsList :groups="mockGroups" />
</template>
