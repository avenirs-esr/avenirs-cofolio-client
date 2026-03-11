<script lang="ts" setup>
import AssociatedElementsTab from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/tabs/AssociatedElementsTab/AssociatedElementsTab.vue'
import MyPerspectiveTab from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/tabs/MyPerspectiveTab/MyPerspectiveTab.vue'
import { ICONS } from '@/features/student/global/icons'
import { AvTab, AvTabs, MS_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const activeTab = ref(0)
const dummyElementCount = 5 // TODO: #1211
</script>

<template>
  <AvTabs v-model="activeTab">
    <AvTab
      :title="t('student.buildProject.activities.views.ProjectActivityDetailedView.MyPerspectiveSection.MyPerspectiveTab.title')"
      :icon="MS_ICONS.CLOCK_LOADER_90"
    >
      <MyPerspectiveTab />
    </AvTab>
    <AvTab
      :title="t('student.buildProject.activities.views.ProjectActivityDetailedView.MyPerspectiveSection.AssociatedElementsTab.title', { count: dummyElementCount })"
      :icon="ICONS.ASSOCIATED"
    >
      <AssociatedElementsTab />
    </AvTab>
  </AvTabs>
</template>
