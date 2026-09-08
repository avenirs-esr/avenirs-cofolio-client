<script setup lang="ts">
import type { BaseApiException } from '@/common/exceptions'
import { EAssociationContextType, EDeclaredActivityStatus, type TraceAssociationsDTO } from '@/api/avenir-esr'
import AssociationElementsDropdown
  from '@/common/associations/components/AssociationElementsDropdown/AssociationElementsDropdown.vue'
import QuerySuspense
  from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useModal } from '@/common/composables'
import { AssociatedDeclaredActivitiesCard } from '@/features/student/buildProject'
import { AssociatedDeclaredSkillsCard } from '@/features/student/declaredSkills'
import { AssociatedDeclaredExperiencesCard } from '@/features/student/personalCareer'
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

const { associations, traceId, associationsError, disabled } = defineProps<TraceAssociationsProps>()

const { t } = useI18n()

export interface TraceAssociationsProps {
  associations: TraceAssociationsDTO | undefined
  traceId: string
  associationsError?: BaseApiException | null
  disabled?: boolean
}

const { modalOpened: skillsModalOpened, openModal: openSkillsModal, closeModal: closeSkillsModal } = useModal()
const { modalOpened: activitiesModalOpened, openModal: openActivitiesModal, closeModal: closeActivitiesModal } = useModal()

const { modalOpened: associateActivitiesModalOpened, openModal: openAssociateActivitiesModal, closeModal: closeAssociateActivitiesModal } = useModal()
const { modalOpened: associationModalOpened, openModal: openAssociationModal, closeModal: closeAssociationModal } = useModal()
const { modalOpened: associateExperiencesModalOpened, openModal: openAssociateExperiencesModal, closeModal: closeAssociateExperiencesModal } = useModal()

const declaredSkillAssociations = computed(() => associations?.declaredSkillAssociations ?? [])
const declaredActivityAssociations = computed(() => associations?.declaredActivityAssociations ?? [])
const declaredExperienceAssociations = computed(() => associations?.declaredExperienceAssociations ?? [])

const countAssociations = computed(() => declaredSkillAssociations.value.length + declaredActivityAssociations.value.length + declaredExperienceAssociations.value.length)

const deletableDeclaredActivityAssociations = computed(() =>
  declaredActivityAssociations.value.filter(({ declaredActivity }) => declaredActivity.status !== EDeclaredActivityStatus.COMPLETED)
)

const deleteItems = computed(() => [
  { type: EAssociationContextType.DECLARED_SKILL, disabled: declaredSkillAssociations.value.length === 0 },
  { type: EAssociationContextType.DECLARED_ACTIVITY, disabled: deletableDeclaredActivityAssociations.value.length === 0 },
])

const associateItems = computed(() => [
  { type: EAssociationContextType.DECLARED_ACTIVITY },
  ...(__DEMO_MODE__ ? [] : [{ type: EAssociationContextType.DECLARED_EXPERIENCE }]),
  { type: EAssociationContextType.DECLARED_SKILL },
])

function onDeleteSelect (type: EAssociationContextType) {
  switch (type) {
    case EAssociationContextType.DECLARED_ACTIVITY:
      openActivitiesModal()
      break
    case EAssociationContextType.DECLARED_SKILL:
      openSkillsModal()
      break
  }
}

function onAssociateSelect (type: EAssociationContextType) {
  switch (type) {
    case EAssociationContextType.DECLARED_ACTIVITY:
      openAssociateActivitiesModal()
      break
    case EAssociationContextType.DECLARED_SKILL:
      openAssociationModal()
      break
    case EAssociationContextType.DECLARED_EXPERIENCE:
      openAssociateExperiencesModal()
      break
  }
}
</script>

<template>
  <div
    class="av-col av-gap-xl av-pt-xl"
    data-testid="trace-associations"
  >
    <div class="av-row av-flex-fill av-justify-end av-gap-md">
      <AssociationElementsDropdown
        variant="delete"
        data-testid="delete-trace-associated-elements-dropdown"
        :disabled="disabled"
        :items="deleteItems"
        @select="onDeleteSelect"
      />
      <AssociationElementsDropdown
        variant="associate"
        data-testid="trace-associate-elements-dropdown"
        :disabled="disabled"
        :items="associateItems"
        @select="onAssociateSelect"
      />
    </div>

    <slot name="caption" />

    <QuerySuspense
      :error="associationsError"
      :error-title="t('student.traces.views.StudentTraceView.errors.fetchAssociations')"
      :empty-state-message="t('student.traces.views.StudentTraceView.empty.associations')"
      :is-empty="countAssociations === 0"
    >
      <div class="av-col av-gap-md">
        <AssociatedDeclaredSkillsCard
          :associated-declared-skills="declaredSkillAssociations"
          :disabled="disabled"
        />
        <AssociatedDeclaredActivitiesCard
          :associated-activities="declaredActivityAssociations"
          :disabled="disabled"
        />

        <AssociatedDeclaredExperiencesCard
          :associated-experiences="declaredExperienceAssociations"
          :disabled="disabled"
        />
      </div>
    </QuerySuspense>
  </div>

  <AssociateActivitiesToTracesModal
    :opened="associateActivitiesModalOpened"
    :trace-id="traceId"
    @cancel="closeAssociateActivitiesModal"
    @associated="closeAssociateActivitiesModal"
  />

  <DeleteTraceAssociatedSkillsModal
    :opened="skillsModalOpened"
    :trace-id="traceId"
    :associations="declaredSkillAssociations"
    @cancel="closeSkillsModal"
    @deleted="closeSkillsModal"
  />

  <DeleteTraceAssociatedActivitiesModal
    :opened="activitiesModalOpened"
    :trace-id="traceId"
    :associations="declaredActivityAssociations"
    @cancel="closeActivitiesModal"
    @deleted="closeActivitiesModal"
  />

  <AssociateDeclaredSkillsToTracesModal
    :opened="associationModalOpened"
    :trace-id="traceId"
    @cancel="closeAssociationModal"
    @associated="closeAssociationModal"
  />

  <AssociateDeclaredExperiencesToTracesModal
    :opened="associateExperiencesModalOpened"
    :trace-id="traceId"
    @cancel="closeAssociateExperiencesModal"
    @associated="closeAssociateExperiencesModal"
  />
</template>
