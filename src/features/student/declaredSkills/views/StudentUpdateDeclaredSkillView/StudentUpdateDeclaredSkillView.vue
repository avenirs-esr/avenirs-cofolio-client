<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useNavigation } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import { useDeclaredSkillDetailedQuery } from '@/features/student/declaredSkills/queries/use-declared-skills.query/use-declared-skills.query'
import UpdateDeclaredSkillAssociations
  from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/components/UpdateDeclaredSkillAssociations/UpdateDeclaredSkillAssociations.vue'
import UpdateDeclaredSkillForm
  from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/components/UpdateDeclaredSkillForm/UpdateDeclaredSkillForm.vue'
import UpdateInProgressBadge from '@/features/student/global/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.vue'
import { AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface StudentUpdateDeclaredSkillViewProps {
  skillId: string
}

const { skillId } = defineProps<StudentUpdateDeclaredSkillViewProps>()
enum StudentUpdateDeclaredSkillViewTabs {
  DETAILS = 0,
  ASSOCIATIONS = 1
}

const { t } = useI18n()
const { navigateToStudentDeclaredSkill } = useNavigation()
const { declaredSkillDetailed } = useDeclaredSkillDetailedQuery(skillId)

const activeTab = ref(StudentUpdateDeclaredSkillViewTabs.DETAILS)
const updateInProgress = ref(false)

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.global.navigation.tabs.project.items.skills'), to: ROUTES.STUDENT.PROJECT_SKILLS },
  { text: t('student.global.navigation.tabs.project.items.declaredSkills') }
])

function backToStudentDeclaredSkillViewTabs () {
  navigateToStudentDeclaredSkill()
}
</script>

<template>
  <PageTitle
    :title="t('student.declaredSkills.views.StudentUpdateDeclaredSkillView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTES.STUDENT.PROJECT_SKILLS"
  />

  <div
    class="update-declared-skill-view__title av-row av-py-md"
    data-testid="update-declared-skill-view__title"
  >
    <span class="n4">{{ declaredSkillDetailed?.title ?? '' }}</span>
  </div>

  <UpdateInProgressBadge :show="updateInProgress" />

  <AvTabs v-model="activeTab">
    <AvTab
      :title="t('student.declaredSkills.views.StudentUpdateDeclaredSkillView.tabs.details.title')"
      :icon="MDI_ICONS.INFORMATION_OUTLINE"
    >
      <UpdateDeclaredSkillForm
        v-if="declaredSkillDetailed"
        :declared-skill-progress-details="declaredSkillDetailed!"
        :on-skill-updated="backToStudentDeclaredSkillViewTabs"
        :on-cancel="backToStudentDeclaredSkillViewTabs"
        @dirty-change="updateInProgress = $event"
      />
    </AvTab>
    <AvTab
      :title="t('student.global.myAssociationsWithCount', { count: declaredSkillDetailed?.traceAssociations?.length ?? 0 })"
      :icon="MDI_ICONS.LINK"
    >
      <UpdateDeclaredSkillAssociations
        v-if="declaredSkillDetailed"
        :trace-associations="declaredSkillDetailed.traceAssociations"
        :declared-skill-id="declaredSkillDetailed.id"
      />
    </AvTab>
  </AvTabs>
</template>

<style lang="scss" scoped>
.update-declared-skill-view {
  &__title {
    .n4 {
      color: var(--text2);
    }
  }
}
</style>
