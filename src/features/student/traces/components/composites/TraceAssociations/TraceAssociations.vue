<script setup lang="ts">
import type { BaseApiException } from '@/common/exceptions'
import { EDeclaredActivityStatus, type TraceAssociationsDTO } from '@/api/avenir-esr'
import QuerySuspense
  from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useModal } from '@/common/composables'
import { AssociatedDeclaredActivitiesCard } from '@/features/student/buildProject'
import { AssociatedDeclaredSkillsCard } from '@/features/student/declaredSkills'
import DeleteTraceAssociatedElementsDropdown
  from '@/features/student/traces/views/StudentTraceView/components/overlays/dropdowns/DeleteTraceAssociatedElementsDropdown/DeleteTraceAssociatedElementsDropdown.vue'
import TraceAssociateElementsDropdown
  from '@/features/student/traces/views/StudentTraceView/components/overlays/dropdowns/TraceAssociateElementsDropdown/TraceAssociateElementsDropdown.vue'
import AssociateActivitiesToTracesModal
  from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateActivitiesToTracesModal/AssociateActivitiesToTracesModal.vue'
import AssociateDeclaredExperiencesToTracesModal
  from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateDeclaredExperiencesToTracesModal/AssociateDeclaredExperiencesToTracesModal.vue'
import AssociateDeclaredSkillsToTracesModal
  from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/AssociateDeclaredSkillsToTracesModal/AssociateDeclaredSkillsToTracesModal.vue'
import DeleteTraceAssociatedActivitiesModal
  from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/DeleteTraceAssociatedActivitiesModal/DeleteTraceAssociatedActivitiesModal.vue'
import DeleteTraceAssociatedSkillsModal
  from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/DeleteTraceAssociatedSkillsModal/DeleteTraceAssociatedSkillsModal.vue'
import { useI18n } from 'vue-i18n'

const { associations, traceId, associationsError } = defineProps<TraceAssociationsProps>()

const { t } = useI18n()

export interface TraceAssociationsProps {
  associations: TraceAssociationsDTO | undefined
  traceId: string
  associationsError?: BaseApiException | null
}

const { showModal: showSkillsModal, displayModal: displaySkillsModal, hideModal: hideSkillsModal } = useModal()
const { showModal: showActivitiesModal, displayModal: displayActivitiesModal, hideModal: hideActivitiesModal } = useModal()

const { showModal: showAssociateActivitiesModal, displayModal: displayAssociateActivitiesModal, hideModal: hideAssociateActivitiesModal } = useModal()
const { showModal: showAssociationModal, displayModal: displayAssociationModal, hideModal: hideAssociationModal } = useModal()
const { showModal: showAssociateExperiencesModal, displayModal: displayAssociateExperiencesModal, hideModal: hideAssociateExperiencesModal } = useModal()

const declaredSkillAssociations = computed(() => associations?.declaredSkillAssociations ?? [])
const declaredActivityAssociations = computed(() => associations?.declaredActivityAssociations ?? [])
const declaredExperienceAssociations = computed(() => associations?.declaredExperienceAssociations ?? [])

const countAssociations = computed(() => declaredSkillAssociations.value.length + declaredActivityAssociations.value.length + declaredExperienceAssociations.value.length)

const deletableDeclaredActivityAssociations = computed(() =>
  declaredActivityAssociations.value.filter(({ declaredActivity }) => declaredActivity.status !== EDeclaredActivityStatus.COMPLETED)
)
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
        @experiences-selected="displayAssociateExperiencesModal"
      />
    </div>

    <slot name="caption" />

    <QuerySuspense
      :error="associationsError"
      :error-title="t('student.traces.views.StudentTraceView.errors.fetchAssociations')"
      :empty-state-message="t('student.traces.views.StudentTraceView.empty.associations')"
      :is-empty="countAssociations === 0"
    >
      <AssociatedDeclaredSkillsCard :associated-declared-skills="declaredSkillAssociations" />
      <AssociatedDeclaredActivitiesCard :associated-activities="declaredActivityAssociations" />
    </QuerySuspense>
  </div>

  <AssociateActivitiesToTracesModal
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

  <AssociateDeclaredSkillsToTracesModal
    :show="showAssociationModal"
    :trace-id="traceId"
    @cancel="hideAssociationModal"
    @associated="hideAssociationModal"
  />

  <AssociateDeclaredExperiencesToTracesModal
    :show="showAssociateExperiencesModal"
    :trace-id="traceId"
    @cancel="hideAssociateExperiencesModal"
    @associated="hideAssociateExperiencesModal"
  />
</template>
