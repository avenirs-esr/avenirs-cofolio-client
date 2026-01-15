<script setup lang="ts">
import AmsTab
  from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/components/AmsTab/AmsTab.vue'
import DeclaredExperiencesTab
  from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/components/DeclaredExperiencesTab/DeclaredExperiencesTab.vue'
import VerifiedExperiencesTab
  from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/components/VerifiedExperiencesTab/VerifiedExperiencesTab.vue'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <AvTabs>
    <AvTab
      :icon="MDI_ICONS.FLARE"
      :title="t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.DeclaredExperiencesTab.title')"
    >
      <DeclaredExperiencesTab />
    </AvTab>
    <AvTab
      :icon="MDI_ICONS.CHECK_DECAGRAM_OUTLINE"
      :title="t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.VerifiedExperiencesTab.title')"
    >
      <VerifiedExperiencesTab />
    </AvTab>
    <AvTab
      :icon="MDI_ICONS.BOOK_OUTLINE"
      :title="t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.AmsTab.title')"
    >
      <AmsTab />
    </AvTab>
  </AvTabs>
</template>
