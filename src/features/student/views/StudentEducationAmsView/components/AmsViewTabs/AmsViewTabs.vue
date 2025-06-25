<script setup lang="ts">
import AmsListContainer from '@/features/student/views/StudentEducationAmsView/components/AmsListContainer/AmsListContainer.vue'
import AmsPlanningContainer from '@/features/student/views/StudentEducationAmsView/components/AmsPlanningContainter/AmsPlanningContainer.vue'
import { AvTab, AvTabs, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const activeTab = ref(0)
</script>

<template>
  <AvTabs v-model="activeTab">
    <AvTab
      :title="t('student.views.studentEducationAmsView.amsViewTabs.list')"
      :icon="MDI_ICONS.FORMAT_LIST_BULLETED"
    >
      <AmsListContainer />
    </AvTab>
    <AvTab
      :title="t('student.views.studentEducationAmsView.amsViewTabs.planning')"
      :icon="MDI_ICONS.CALENDAR_MONTH"
    >
      <AmsPlanningContainer />
    </AvTab>
  </AvTabs>
</template>

<style lang="scss" scoped></style>
