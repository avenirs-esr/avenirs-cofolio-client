<script setup lang="ts">
import SkillsViewOtherTab from '@/features/student/views/StudentProjectSkillsView/components/SkillsViewOtherTab/SkillsViewOtherTab.vue'
import { AvTab, AvTabs, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const activeTab = ref(0)
</script>

<template>
  <AvTabs v-model="activeTab">
    <AvTab
      :title="t('student.views.studentProjectSkillsView.skillsViewTabs.education')"
      :icon="MDI_ICONS.STARS"
    >
      TODO #411 Placeholder...
    </AvTab>
    <AvTab
      :title="t('student.views.studentProjectSkillsView.skillsViewTabs.other')"
      :icon="MDI_ICONS.STARS"
    >
      <SkillsViewOtherTab />
    </AvTab>
  </AvTabs>
</template>

<style lang="scss" scoped></style>
