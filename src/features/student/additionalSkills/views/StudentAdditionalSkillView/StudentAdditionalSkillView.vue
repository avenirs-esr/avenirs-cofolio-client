<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useNavigation } from '@/common/composables'
import { ROUTE_NAMES } from '@/common/constants'
import { useAdditionalSkillDetailedQuery } from '@/features/student/additionalSkills/queries/use-additional-skills.query/use-additional-skills.query'
import AdditionalSkillDetails
  from '@/features/student/additionalSkills/views/StudentAdditionalSkillView/components/AdditionalSkillDetails/AdditionalSkillDetails.vue'
import AdditionalSkillSettingDropdown
  from '@/features/student/additionalSkills/views/StudentAdditionalSkillView/components/AdditionalSkillSettingDropdown/AdditionalSkillSettingDropdown.vue'
import StudentAdditionalSkillAssociations
  from '@/features/student/additionalSkills/views/StudentAdditionalSkillView/components/StudentAdditionalSkillAssociations/StudentAdditionalSkillAssociations.vue'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface StudentAdditionalSkillViewProps {
  skillId: string
}

const { skillId } = defineProps<StudentAdditionalSkillViewProps>()

enum StudentAdditionalSkillViewTabs {
  DETAILS = 0,
  ASSOCIATIONS = 1
}

const { t } = useI18n()
const { navigateToStudentUpdateAdditionalSkill } = useNavigation()

const { additionalSkillDetailed } = useAdditionalSkillDetailedQuery(skillId)

const activeTab = ref(StudentAdditionalSkillViewTabs.DETAILS)

const skillTitle = computed(() => additionalSkillDetailed.value?.title ?? '')
const countAssociations = computed(() => additionalSkillDetailed.value?.traceAssociations?.length ?? 0)

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: ROUTE_NAMES.STUDENT.HOME },
  { text: t('student.navigation.tabs.project.header') },
  { text: t('student.navigation.tabs.project.items.skills'), to: ROUTE_NAMES.STUDENT.PROJECT_SKILLS },
  { text: t('student.navigation.tabs.project.items.additionalSkills') }
])

function handleUpdateSelected () {
  navigateToStudentUpdateAdditionalSkill()
}
</script>

<template>
  <PageTitle
    :title="t('student.views.studentAdditionalSkillView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTE_NAMES.STUDENT.PROJECT_SKILLS"
  />

  <div class="student-additional-skill-view__title av-row-lg av-row-lg--top av-row-lg--between">
    <span class="n4">{{ skillTitle }}</span>
    <AdditionalSkillSettingDropdown @update-selected="handleUpdateSelected" />
  </div>

  <AvTabs v-model="activeTab">
    <AvTab
      :title="t('student.views.studentAdditionalSkillView.tabs.details.title')"
      :icon="MDI_ICONS.INFORMATION_OUTLINE"
    >
      <AdditionalSkillDetails
        v-if="additionalSkillDetailed"
        :additional-skill-progress-details="additionalSkillDetailed"
      />
    </AvTab>
    <AvTab
      :title="t('student.global.myAssociationsWithCount', { count: countAssociations })"
      :icon="MDI_ICONS.LINK"
    >
      <StudentAdditionalSkillAssociations
        v-if="additionalSkillDetailed"
        :trace-associations="additionalSkillDetailed.traceAssociations"
      />
    </AvTab>
  </AvTabs>
</template>

<style lang="scss" scoped>
@use '@avenirs-esr/avenirs-dsav/src/styles/settings/breakpoints' as *;

.student-additional-skill-view {
  &__title {
    gap: var(--spacing-sm);
    padding: 0 0 var(--spacing-md) 0;

    .n4 {
      color: var(--text2);
    }
  }
  &__actions {
    display: flex;
    justify-content: flex-end;
    padding:  var(--spacing-md) 0;
  }
}
</style>
