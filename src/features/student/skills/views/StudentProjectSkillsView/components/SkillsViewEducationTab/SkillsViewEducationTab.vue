<script setup lang="ts">
import { useGetSkillLevelProgresses } from '@/api/avenir-esr'
import { Pagination } from '@/common/components'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useBaseApiExceptionToast, usePagination } from '@/common/composables'
import StudentDetailedEducationalSkillCard from '@/features/student/skills/components/cards/StudentDetailedEducationalSkillCard/StudentDetailedEducationalSkillCard.vue'
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

const params = computed(() => ({
  sort: search.value,
  page: currentPage.value,
  pageSize: pageSizeSelected.value,
}))

const { data, error, isPending } = useGetSkillLevelProgresses(params)
const skills = computed(() => data.value?.data ?? [])
const pageInfo = computed(() => data.value?.page)
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
    <QuerySuspense
      :error="error"
      :is-loading="isPending"
      :is-empty="skills.length === 0"
    >
      <Pagination
        v-if="pageInfo"
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
    </QuerySuspense>
  </div>
</template>
