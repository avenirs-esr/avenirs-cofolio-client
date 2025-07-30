<script setup lang="ts">
import { Pagination } from '@/common/components'
import { useBaseApiExceptionToast, usePagination } from '@/common/composables'
import { useSkillsViewQuery } from '@/features/student/queries'
import { useSkillsStore } from '@/store/skills/skills'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const skillsStore = useSkillsStore()
const {
  currentPage,
  pageSizeSelected,
  onUpdateCurrentPage,
  onUpdatePageSize
} = usePagination(toRef(skillsStore, 'currentPage'), toRef(skillsStore, 'pageSizeSelected'))

const search = ref('')

const { skills, pageInfo, error } = useSkillsViewQuery(search, currentPage, pageSizeSelected)
useBaseApiExceptionToast(error)
</script>

<template>
  <div class="main-container">
    <div class="title-container">
      <h5 class="n5">
        {{ t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewEducationTab.title') }}
        <span class="b1-regular">
          {{ t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewEducationTab.subtitle') }}
        </span>
      </h5>
    </div>
    <div class="skills-container">
      <Pagination
        :page-info="pageInfo"
        :page-size-selected="pageSizeSelected"
        :on-update-current-page="onUpdateCurrentPage"
        :on-update-page-size="onUpdatePageSize"
      >
        TODO Placeholder #412... {{ skills.length }}
      </Pagination>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-container {
  display: flex;
  flex-direction: column;
}

.title-container {
  padding-bottom: var(--spacing-sm);
}

.skills-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.n5, .b1-regular {
  color: var(--text1);
}
</style>
