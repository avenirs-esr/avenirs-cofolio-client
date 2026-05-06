<script lang="ts" setup>
import { type DeclaredActivityDetailsDTO, useGetDeclaredActivityAssociations } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import AssociatedElementsTab from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/tabs/AssociatedElementsTab/AssociatedElementsTab.vue'
import MyPerspectiveTab from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/tabs/MyPerspectiveTab/MyPerspectiveTab.vue'
import { AvTab, AvTabs } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface MyPerspectiveSectionProps {
  declaredActivityDetails: DeclaredActivityDetailsDTO
}

const { declaredActivityDetails } = defineProps<MyPerspectiveSectionProps>()

const { t } = useI18n()
const { data: declaredActivityAssociations, isPending, error } = useGetDeclaredActivityAssociations(declaredActivityDetails.id)

const activeTab = ref(0)
const associationsCount = computed(() =>
  (declaredActivityAssociations.value?.traceAssociations.length ?? 0)
  + (declaredActivityAssociations.value?.declaredSkillAssociations.length ?? 0)
)
</script>

<template>
  <AvTabs
    v-model="activeTab"
    data-testid="my-perspective-section"
  >
    <AvTab
      :title="t('student.buildProject.activities.views.ProjectActivityDetailedView.MyPerspectiveSection.MyPerspectiveTab.title')"
      :icon="ICONS.ACTIVITY_PERSPECTIVE"
      data-testid="my-perspective-tab-item"
    >
      <MyPerspectiveTab :declared-activity-details="declaredActivityDetails" />
    </AvTab>
    <AvTab
      :title="t('student.buildProject.activities.views.ProjectActivityDetailedView.MyPerspectiveSection.AssociatedElementsTab.title', { count: associationsCount })"
      :icon="ICONS.ASSOCIATED"
      data-testid="associated-elements-tab-item"
    >
      <AssociatedElementsTab
        v-if="declaredActivityAssociations"
        :declared-activity-id="declaredActivityDetails.id"
        :associations="declaredActivityAssociations"
        :count-associations="associationsCount"
        :error="error"
        :is-loading="isPending"
      />
    </AvTab>
  </AvTabs>
</template>
