<script setup lang="ts">
import DeclaredProgramsTab
  from '@/features/student/personalCareer/views/PersonalCareerView/sections/ProgramsSection/components/DeclaredProgramsTab/DeclaredProgramsTab.vue'
import VerifiedProgramsTab
  from '@/features/student/personalCareer/views/PersonalCareerView/sections/ProgramsSection/components/VerifiedProgramsTab/VerifiedProgramsTab.vue'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <AvTabs>
    <AvTab
      :icon="MDI_ICONS.FLARE"
      :title="t('student.personalCareer.views.PersonalCareerView.ProgramsSection.DeclaredProgramsTab.title')"
    >
      <DeclaredProgramsTab />
    </AvTab>
    <AvTab
      :icon="MDI_ICONS.CHECK_DECAGRAM_OUTLINE"
      :title="t('student.personalCareer.views.PersonalCareerView.ProgramsSection.VerifiedProgramsTab.title')"
    >
      <VerifiedProgramsTab />
    </AvTab>
  </AvTabs>
</template>
