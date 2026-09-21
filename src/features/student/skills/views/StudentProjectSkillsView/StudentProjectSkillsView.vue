<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { AddDeclaredSkillDrawer, useDeclaredSkillsStore } from '@/features/student/declaredSkills'
import SkillsViewOtherTab from '@/features/student/skills/views/StudentProjectSkillsView/components/SkillsViewOtherTab/SkillsViewOtherTab.vue'
import { AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { displayCreateDeclaredSkillDrawer } = useDeclaredSkillsStore()
</script>

<template>
  <PageTitle :title="t('student.skills.views.StudentProjectSkillsView.title')">
    <template #actions>
      <AvButton
        variant="OUTLINED"
        :label="t('student.skills.views.StudentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addSkillButton')"
        :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
        small
        data-testid="add-declared-skill-button"
        @click="displayCreateDeclaredSkillDrawer"
      />
    </template>
  </PageTitle>
  <SkillsViewOtherTab />

  <AddDeclaredSkillDrawer />
</template>
