<script setup lang="ts">
import { Pagination } from '@/common/components'
import { useBaseApiExceptionToast, usePagination } from '@/common/composables'
import { useAdditionalSkillsStore } from '@/features/student/additionalSkills'
import { useAdditionalSkillsViewQuery } from '@/features/student/queries'
import AddAdditionalSkillDrawer from '@/features/student/skills/views/StudentProjectSkillsView/components/AddAdditionalSkillDrawer/AddAdditionalSkillDrawer.vue'
import StudentDetailedAdditionalSkillCard from '@/features/student/skills/views/StudentProjectSkillsView/components/SkillsViewOtherTab/components/StudentDetailedAdditionalSkillCard/StudentDetailedAdditionalSkillCard.vue'
import { AvButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const additionalSkillsStore = useAdditionalSkillsStore()
const {
  currentPage,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePagination(toRef(additionalSkillsStore, 'currentPage'), toRef(additionalSkillsStore, 'pageSizeSelected'))

const { skills, pageInfo, error } = useAdditionalSkillsViewQuery(currentPage, pageSizeSelected)
useBaseApiExceptionToast(error)

function handleAddSkill (): void {
  additionalSkillsStore.displayCreateAdditionalSkillDrawer()
}
</script>

<template>
  <div class="skills-view-other-tab">
    <div class="skills-view-other-tab__button-container">
      <AvButton
        variant="OUTLINED"
        size="sm"
        :label="t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addSkillButton')"
        :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
        @click="handleAddSkill"
      />
    </div>
    <div class="skills-view-other-tab__content-placeholder">
      <Pagination
        :page-info="pageInfo"
        :page-size-selected="pageSizeSelected"
        :on-update-current-page="onUpdateCurrentPage"
        :on-update-page-size="onUpdatePageSize"
      >
        <div class="skills-container">
          <StudentDetailedAdditionalSkillCard
            v-for="skill in skills"
            :key="skill.id"
            :additional-skill="skill"
          />
        </div>
      </Pagination>
    </div>

    <AddAdditionalSkillDrawer />
  </div>
</template>

<style lang="scss" scoped>
.skills-view-other-tab {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.skills-view-other-tab__button-container {
  display: flex;
  justify-content: flex-end;
}

.skills-container {
  padding: var(--spacing-lg) var(--spacing-none);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
</style>
