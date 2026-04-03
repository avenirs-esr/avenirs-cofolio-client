<script setup lang="ts">
import { EDeclaredActivityStatus, type TraceAssociationsDTO } from '@/api/avenir-esr'
import { useModal } from '@/common/composables'
import AssociatedActivityCard from '@/features/student/global/components/cards/AssociatedActivityCard/AssociatedActivityCard.vue'
import AssociatedSkillCard from '@/features/student/global/components/cards/AssociatedSkillCard/AssociatedSkillCard.vue'
import { ICONS } from '@/features/student/global/icons'
import DeleteTraceAssociatedElementsDropdown
  from '@/features/student/traces/views/StudentTraceView/components/overlays/dropdowns/DeleteTraceAssociatedElementsDropdown/DeleteTraceAssociatedElementsDropdown.vue'
import TraceAssociateElementsDropdown
  from '@/features/student/traces/views/StudentTraceView/components/overlays/dropdowns/TraceAssociateElementsDropdown/TraceAssociateElementsDropdown.vue'
import AssociateActivitiesModal
  from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateActivitiesModal/AssociateActivitiesModal.vue'
import AssociateDeclaredSkillsModal
  from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateDeclaredSkillsModal/AssociateDeclaredSkillsModal.vue'
import DeleteTraceAssociatedActivitiesModal
  from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/DeleteTraceAssociatedActivitiesModal/DeleteTraceAssociatedActivitiesModal.vue'
import DeleteTraceAssociatedSkillsModal
  from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/DeleteTraceAssociatedSkillsModal/DeleteTraceAssociatedSkillsModal.vue'
import { AvCard, AvIconText } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface TraceAssociationsProps {
  associations: TraceAssociationsDTO
  traceId: string
}

const { associations, traceId } = defineProps<TraceAssociationsProps>()

const { t } = useI18n()

const { showModal: showSkillsModal, displayModal: displaySkillsModal, hideModal: hideSkillsModal } = useModal()
const { showModal: showActivitiesModal, displayModal: displayActivitiesModal, hideModal: hideActivitiesModal } = useModal()
const { showModal: showAssociateActivitiesModal, displayModal: displayAssociateActivitiesModal, hideModal: hideAssociateActivitiesModal } = useModal()
const { showModal: showAssociationModal, displayModal: displayAssociationModal, hideModal: hideAssociationModal } = useModal()

const declaredSkillAssociations = computed(() => associations.declaredSkillAssociations ?? [])
const declaredActivityAssociations = computed(() => associations.declaredActivityAssociations ?? [])

const deletableDeclaredActivityAssociations = computed(() => declaredActivityAssociations.value.filter(({ declaredActivity }) => declaredActivity.status !== EDeclaredActivityStatus.COMPLETED))
</script>

<template>
  <div
    class="av-col av-gap-xl av-pt-xl"
    data-testid="trace-associations"
  >
    <div class="av-row av-flex-fill av-justify-end av-gap-md">
      <DeleteTraceAssociatedElementsDropdown
        :activities-disabled="deletableDeclaredActivityAssociations.length === 0"
        :skills-disabled="declaredSkillAssociations.length === 0"
        @activities-selected="displayActivitiesModal"
        @skills-selected="displaySkillsModal"
      />
      <TraceAssociateElementsDropdown
        @skills-selected="displayAssociationModal"
        @activities-selected="displayAssociateActivitiesModal"
      />
    </div>

    <slot name="caption" />

    <AvCard
      v-if="declaredSkillAssociations.length > 0"
      data-testid="declared-skill-associations-container"
      background-color="var(--surface-background)"
      title-background="var(--surface-background)"
      border-color="var(--stroke)"
      collapsible
      collapsed
    >
      <template #title>
        <div class="av-row av-align-center av-justify-between av-w-full av-gap-md av-px-md">
          <AvIconText
            typography-class="n5"
            :icon="ICONS.SKILLS"
            icon-color="var(--icon)"
            :text="t('student.global.myDeclaredSkillCount', { count: declaredSkillAssociations.length })"
            text-color="var(--title)"
            gap="var(--spacing-sm)"
          />
        </div>
      </template>

      <div class="av-row av-justify-start av-gap-md av-wrap category-elements-paginator__cards">
        <AssociatedSkillCard
          v-for="skill in declaredSkillAssociations"
          :key="skill.associationId"
          :declared-skill="skill.declaredSkill"
          data-testid="associated-skill-card"
        />
      </div>
    </AvCard>

    <AvCard
      v-if="declaredActivityAssociations.length > 0"
      data-testid="declared-activity-associations-container"
      background-color="var(--surface-background)"
      title-background="var(--surface-background)"
      border-color="var(--stroke)"
      collapsible
      collapsed
    >
      <template #title>
        <div class="av-row av-align-center av-justify-between av-w-full av-gap-md av-px-md">
          <AvIconText
            typography-class="n5"
            :icon="ICONS.ACTIVITY"
            icon-color="var(--icon)"
            :text="t('student.global.myDeclaredActivityCount', { count: declaredActivityAssociations.length })"
            text-color="var(--title)"
            gap="var(--spacing-sm)"
          />
        </div>
      </template>

      <div class="av-row av-justify-start av-gap-md av-wrap">
        <AssociatedActivityCard
          v-for="activityAssociation in declaredActivityAssociations"
          :key="activityAssociation.associationId"
          :declared-activity="activityAssociation.declaredActivity"
          data-testid="associated-activity-card"
        />
      </div>
    </AvCard>
  </div>

  <AssociateActivitiesModal
    :show="showAssociateActivitiesModal"
    :trace-id="traceId"
    @cancel="hideAssociateActivitiesModal"
    @associated="hideAssociateActivitiesModal"
  />

  <DeleteTraceAssociatedSkillsModal
    :show="showSkillsModal"
    :trace-id="traceId"
    :associations="declaredSkillAssociations"
    @cancel="hideSkillsModal"
    @deleted="hideSkillsModal"
  />

  <DeleteTraceAssociatedActivitiesModal
    :show="showActivitiesModal"
    :trace-id="traceId"
    :associations="deletableDeclaredActivityAssociations"
    @cancel="hideActivitiesModal"
    @deleted="hideActivitiesModal"
  />

  <AssociateDeclaredSkillsModal
    :show="showAssociationModal"
    @cancel="hideAssociationModal"
    @associated="hideAssociationModal"
  />
</template>
