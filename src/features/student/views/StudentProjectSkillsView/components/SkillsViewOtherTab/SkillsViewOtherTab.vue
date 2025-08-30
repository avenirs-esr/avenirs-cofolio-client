<script setup lang="ts">
import { Pagination } from '@/common/components'
import { useBaseApiExceptionToast, usePagination } from '@/common/composables'
import StudentDetailedAdditionalSkillCard
  from '@/features/student/components/cards/StudentDetailedAdditionalSkillCard/StudentDetailedAdditionalSkillCard.vue'
import { useAdditionalSkillsViewQuery } from '@/features/student/queries'
import AddAdditionalSkillDrawer from '@/features/student/views/StudentProjectSkillsView/components/AddAdditionalSkillDrawer/AddAdditionalSkillDrawer.vue'
import { useSkillsStore } from '@/store'
import { AvButton, MDI_ICONS } from '@/ui'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const skillsStore = useSkillsStore()
const {
  currentPage,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePagination(toRef(skillsStore, 'additionalCurrentPage'), toRef(skillsStore, 'additionalPageSizeSelected'))

const { skills, pageInfo, error } = useAdditionalSkillsViewQuery(currentPage, pageSizeSelected)
useBaseApiExceptionToast(error)

function handleAddSkill (): void {
  skillsStore.displayCreateAdditionalSkillDrawer()
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
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
</style>
