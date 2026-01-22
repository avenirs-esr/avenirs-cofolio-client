<script setup lang="ts">
import { Pagination } from '@/common/components'
import { useBaseApiExceptionToast, usePagination } from '@/common/composables'
import { AddDeclaredSkillDrawer, useDeclaredSkillsStore, useDeclaredSkillsViewQuery } from '@/features/student/declaredSkills'
import StudentDetailedDeclaredSkillCard from '@/features/student/skills/views/StudentProjectSkillsView/components/SkillsViewOtherTab/components/StudentDetailedDeclaredSkillCard/StudentDetailedDeclaredSkillCard.vue'
import { AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const declaredSkillsStore = useDeclaredSkillsStore()
const {
  currentPage,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePagination(toRef(declaredSkillsStore, 'currentPage'), toRef(declaredSkillsStore, 'pageSizeSelected'))

const { skills, pageInfo, error } = useDeclaredSkillsViewQuery(currentPage, pageSizeSelected)
useBaseApiExceptionToast(error)

function handleAddSkill (): void {
  declaredSkillsStore.displayCreateDeclaredSkillDrawer()
}
</script>

<template>
  <div class="skills-view-other-tab av-col av-gap-xl">
    <div
      class="av-row av-justify-end"
      data-testid="skills-view-other-tab__button-container"
    >
      <AvButton
        variant="OUTLINED"
        :label="t('student.skills.views.StudentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addSkillButton')"
        :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
        small
        @click="handleAddSkill"
      />
    </div>
    <Pagination
      :page-info="pageInfo"
      :page-size-selected="pageSizeSelected"
      :on-update-current-page="onUpdateCurrentPage"
      :on-update-page-size="onUpdatePageSize"
    >
      <div
        class="av-col av-gap-md av-py-lg"
        data-testid="skills-container"
      >
        <StudentDetailedDeclaredSkillCard
          v-for="skill in skills"
          :key="skill.id"
          :declared-skill="skill"
        />
      </div>
    </Pagination>

    <AddDeclaredSkillDrawer />
  </div>
</template>
