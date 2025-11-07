<script setup lang="ts">
import { Pagination } from '@/common/components'
import { useBaseApiExceptionToast, usePagination } from '@/common/composables'
import { StudentDetailedEducationalSkillCard, StudentDetailedPastSkillCard } from '@/features/student/components/cards'
import { useSkillsViewQuery } from '@/features/student/queries'
import { useSkillsStore } from '@/store'
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
    <Pagination
      :page-info="pageInfo"
      :page-size-selected="pageSizeSelected"
      :on-update-current-page="onUpdateCurrentPage"
      :on-update-page-size="onUpdatePageSize"
    >
      <div class="skills-container">
        <template
          v-for="(skill, index) in skills"
          :key="skill.id"
        >
          <StudentDetailedPastSkillCard
            v-if="skill.isProgramFinished"
            :skill="skill"
          />
          <StudentDetailedEducationalSkillCard
            v-else
            :skill="skill"
            :skill-color="`var(--skill${index + 1})`"
          />
        </template>
      </div>
    </Pagination>
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
  padding: var(--spacing-lg) var(--spacing-none);
}

.n5, .b1-regular {
  color: var(--text1);
}
</style>
