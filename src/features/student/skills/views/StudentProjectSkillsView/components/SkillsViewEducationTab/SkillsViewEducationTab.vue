<script setup lang="ts">
import { Pagination } from '@/common/components'
import { useBaseApiExceptionToast, usePagination } from '@/common/composables'
import StudentDetailedEducationalSkillCard from '@/features/student/skills/components/cards/StudentDetailedEducationalSkillCard/StudentDetailedEducationalSkillCard.vue'
import { useSkillsViewQuery } from '@/features/student/skills/queries/use-skills-view.query/use-skills-view.query'
import { useSkillsStore } from '@/features/student/skills/stores/skills.store'
import StudentDetailedPastSkillCard from '@/features/student/skills/views/StudentProjectSkillsView/components/SkillsViewEducationTab/components/StudentDetailedPastSkillCard/StudentDetailedPastSkillCard.vue'
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
  <div class="skills-view-education-tab av-col">
    <div
      class="av-pb-sm"
      data-testid="title-container"
    >
      <span class="n5 av-text-text1">
        {{ t('student.skills.views.StudentProjectSkillsView.skillsViewTabs.skillsViewEducationTab.title') }}
        <span class="b1-regular av-text-text1">
          {{ t('student.skills.views.StudentProjectSkillsView.skillsViewTabs.skillsViewEducationTab.subtitle') }}
        </span>
      </span>
    </div>
    <Pagination
      :page-info="pageInfo"
      :page-size-selected="pageSizeSelected"
      :on-update-current-page="onUpdateCurrentPage"
      :on-update-page-size="onUpdatePageSize"
    >
      <div
        class="av-col av-gap-lg av-py-lg"
        data-testid="skills-container"
      >
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
