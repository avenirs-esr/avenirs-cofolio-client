<script setup lang="ts">
import { PageTitle } from '@/common/components'
import { useNavigation } from '@/common/composables'
import { useAdditionalSkillDetailedQuery } from '@/features/student/queries'
import { studentHomeRoute, studentProjectSkillsRoute } from '@/features/student/routes'
import AdditionalSkillSettingDropdown
  from '@/features/student/views/StudentAdditionalSkillView/components/AdditionalSkillSettingDropdown/AdditionalSkillSettingDropdown.vue'
import StudentAdditionalSkillAssociations
  from '@/features/student/views/StudentAdditionalSkillView/components/StudentAdditionalSkillAssociations/StudentAdditionalSkillAssociations.vue'
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
  { text: t('student.navigation.tabs.home'), to: studentHomeRoute },
  { text: t('student.navigation.tabs.project.header') },
  { text: t('student.navigation.tabs.project.items.skills'), to: studentProjectSkillsRoute },
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
    :back="studentProjectSkillsRoute"
  />

  <div class="student-additional-skill-view__title">
    <span class="n4">{{ skillTitle }}</span>
  </div>

  <div class="student-additional-skill-view__actions">
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
      :title="t('student.views.studentAdditionalSkillView.tabs.associations.title', { count: countAssociations })"
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
.student-additional-skill-view {

  &__title {
    padding: var(--spacing-md) 0;
    display: flex;
    flex-direction: row;

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
