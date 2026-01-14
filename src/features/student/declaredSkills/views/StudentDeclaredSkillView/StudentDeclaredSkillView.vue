<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useNavigation } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import { useDeclaredSkillDetailedQuery } from '@/features/student/declaredSkills/queries/use-declared-skills.query/use-declared-skills.query'
import DeclaredSkillDetails
  from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/DeclaredSkillDetails/DeclaredSkillDetails.vue'
import DeclaredSkillSettingDropdown
  from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/DeclaredSkillSettingDropdown/DeclaredSkillSettingDropdown.vue'
import StudentDeclaredSkillAssociations
  from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/components/StudentDeclaredSkillAssociations/StudentDeclaredSkillAssociations.vue'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface StudentDeclaredSkillViewProps {
  skillId: string
}

const { skillId } = defineProps<StudentDeclaredSkillViewProps>()

enum StudentDeclaredSkillViewTabs {
  DETAILS = 0,
  ASSOCIATIONS = 1
}

const { t } = useI18n()
const { navigateToStudentUpdateDeclaredSkill } = useNavigation()

const { declaredSkillDetailed } = useDeclaredSkillDetailedQuery(skillId)

const activeTab = ref(StudentDeclaredSkillViewTabs.DETAILS)

const skillTitle = computed(() => declaredSkillDetailed.value?.title ?? '')
const countAssociations = computed(() => declaredSkillDetailed.value?.traceAssociations?.length ?? 0)

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.global.navigation.tabs.project.items.skills'), to: ROUTES.STUDENT.PROJECT_SKILLS },
  { text: t('student.global.navigation.tabs.project.items.declaredSkills') }
])

function handleUpdateSelected () {
  navigateToStudentUpdateDeclaredSkill()
}
</script>

<template>
  <PageTitle
    :title="t('student.declaredSkills.views.StudentDeclaredSkillView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTES.STUDENT.PROJECT_SKILLS"
  />

  <div class="student-declared-skill-view__title av-row--lg av-align-baseline--lg av-justify-between--lg">
    <span class="n4">{{ skillTitle }}</span>
    <DeclaredSkillSettingDropdown @update-selected="handleUpdateSelected" />
  </div>

  <AvTabs v-model="activeTab">
    <AvTab
      :title="t('student.declaredSkills.views.StudentDeclaredSkillView.tabs.details.title')"
      :icon="MDI_ICONS.INFORMATION_OUTLINE"
    >
      <DeclaredSkillDetails
        v-if="declaredSkillDetailed"
        :declared-skill-progress-details="declaredSkillDetailed"
      />
    </AvTab>
    <AvTab
      :title="t('student.global.myAssociationsWithCount', { count: countAssociations })"
      :icon="MDI_ICONS.LINK"
    >
      <StudentDeclaredSkillAssociations
        v-if="declaredSkillDetailed"
        :trace-associations="declaredSkillDetailed.traceAssociations"
      />
    </AvTab>
  </AvTabs>
</template>

<style lang="scss" scoped>
.student-declared-skill-view {
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
