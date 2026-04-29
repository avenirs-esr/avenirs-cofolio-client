<script setup lang="ts">
import SkillsViewEducationTab from '@/features/student/skills/views/StudentProjectSkillsView/components/SkillsViewEducationTab/SkillsViewEducationTab.vue'
import SkillsViewOtherTab from '@/features/student/skills/views/StudentProjectSkillsView/components/SkillsViewOtherTab/SkillsViewOtherTab.vue'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const activeTab = defineModel<number>()

const { t } = useI18n()
</script>

<template>
  <AvTabs v-model="activeTab">
    <AvTab
      :title="t('student.skills.views.StudentProjectSkillsView.skillsViewTabs.education')"
      :icon="MDI_ICONS.STARS"
      data-testid="education-skills-tab-item"
    >
      <SkillsViewEducationTab />
    </AvTab>
    <AvTab
      :title="t('student.skills.views.StudentProjectSkillsView.skillsViewTabs.other')"
      :icon="MDI_ICONS.STARS"
      data-testid="declared-skills-tab-item"
    >
      <SkillsViewOtherTab />
    </AvTab>
  </AvTabs>
</template>

<style lang="scss" scoped></style>
