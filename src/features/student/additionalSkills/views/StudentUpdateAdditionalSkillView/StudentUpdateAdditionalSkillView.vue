<script setup lang="ts">
// no barel import to avoid circular dependency
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useNavigation } from '@/common/composables'
import { useAdditionalSkillDetailedQuery } from '@/features/student/additionalSkills/queries/use-additional-skills.query/use-additional-skills.query'
import UpdateAdditionalSkillAssociations
  from '@/features/student/additionalSkills/views/StudentUpdateAdditionalSkillView/components/UpdateAdditionalSkillAssociations/UpdateAdditionalSkillAssociations.vue'
import UpdateAdditionalSkillForm
  from '@/features/student/additionalSkills/views/StudentUpdateAdditionalSkillView/components/UpdateAdditionalSkillForm/UpdateAdditionalSkillForm.vue'
import { studentHomeRoute, studentProjectSkillsRoute } from '@/features/student/routes'
import { AvBadge, AvTab, AvTabs, ICONS_DATA_URL, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface StudentUpdateAdditionalSkillViewProps {
  skillId: string
}

const { skillId } = defineProps<StudentUpdateAdditionalSkillViewProps>()

enum StudentUpdateAdditionalSkillViewTabs {
  DETAILS = 0,
  ASSOCIATIONS = 1
}

const { t } = useI18n()
const { navigateToStudentAdditionalSkill } = useNavigation()
const { additionalSkillDetailed } = useAdditionalSkillDetailedQuery(skillId)

const activeTab = ref(StudentUpdateAdditionalSkillViewTabs.DETAILS)
const updateInProgress = ref(false)

const breadcrumbLinks = computed(() => [
  { text: t('student.navigation.tabs.home'), to: studentHomeRoute },
  { text: t('student.navigation.tabs.project.header') },
  { text: t('student.navigation.tabs.project.items.skills'), to: studentProjectSkillsRoute },
  { text: t('student.navigation.tabs.project.items.additionalSkills') }
])

function backToStudentAdditionalSkillViewTabs () {
  navigateToStudentAdditionalSkill()
}
</script>

<template>
  <PageTitle
    :title="t('student.views.studentUpdateAdditionalSkillView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="studentProjectSkillsRoute"
  />

  <div class="update-additional-skill-view__title">
    <span class="n4">{{ additionalSkillDetailed?.title ?? '' }}</span>
  </div>

  <div
    v-if="updateInProgress"
    class="update-additional-skill-view__uip"
  >
    <AvBadge
      :label="t('student.views.studentUpdateAdditionalSkillView.wipBadge')"
      background-color="var(--dark-background-primary1)"
      color="var(--dark-foreground)"
      :icon-data-url="ICONS_DATA_URL.AMS_SAE"
    />
  </div>

  <AvTabs v-model="activeTab">
    <AvTab
      :title="t('student.views.studentUpdateAdditionalSkillView.tabs.details.title')"
      :icon="MDI_ICONS.INFORMATION_OUTLINE"
    >
      <UpdateAdditionalSkillForm
        v-if="additionalSkillDetailed"
        :additional-skill-progress-details="additionalSkillDetailed!"
        :on-skill-updated="backToStudentAdditionalSkillViewTabs"
        :on-cancel="backToStudentAdditionalSkillViewTabs"
        @dirty-change="updateInProgress = $event"
      />
    </AvTab>
    <AvTab
      :title="t('student.global.myAssociationsWithCount', { count: additionalSkillDetailed?.traceAssociations?.length ?? 0 })"
      :icon="MDI_ICONS.LINK"
    >
      <UpdateAdditionalSkillAssociations
        v-if="additionalSkillDetailed"
        :trace-associations="additionalSkillDetailed.traceAssociations"
        :additional-skill-id="additionalSkillDetailed.id"
      />
    </AvTab>
  </AvTabs>
</template>

<style lang="scss" scoped>
.update-additional-skill-view {
  &__title {
    padding: var(--spacing-md) var(--spacing-none);
    display: flex;
    flex-direction: row;

    .n4 {
      color: var(--text2);
    }
  }

  &__uip {
    display: flex;
    justify-content: flex-end;
    padding: var(--spacing-md) var(--spacing-none);
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    padding:  var(--spacing-md) 0;
  }
}
</style>
