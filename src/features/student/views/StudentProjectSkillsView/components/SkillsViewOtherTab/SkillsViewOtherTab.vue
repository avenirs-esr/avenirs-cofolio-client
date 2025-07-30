<script setup lang="ts">
import { Pagination } from '@/common/components'
import { useBaseApiExceptionToast, usePagination } from '@/common/composables'
import { useAdditionalSkillsViewQuery } from '@/features/student/queries'
import { useSkillsStore } from '@/store/skills/skills'
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

const search = ref('')

const { skills, pageInfo, error } = useAdditionalSkillsViewQuery(search, currentPage, pageSizeSelected)
useBaseApiExceptionToast(error)

function handleAddSkill (): void {
  // TODO: Action will be implemented in a future task
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
        TODO #416 Placeholder {{ skills.length }}...
      </Pagination>
    </div>
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
</style>
