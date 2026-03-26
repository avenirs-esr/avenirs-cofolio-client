<script lang="ts" setup>
import type { AssociationsCreationRequest, EActivityThematic } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions/base-api-exception/base-api.exception'
import { DeclaredActivityCompactCard } from '@/features/student/buildProject'
import { ConfirmAssociateModal, useAssociationModal } from '@/features/student/global'
import SearchAssociationLayout from '@/features/student/global/components/interaction/SearchAssociationLayout/SearchAssociationLayout.vue'
import { ICONS } from '@/features/student/global/icons'
import {
  useAssociateTraceWithActivitiesMutation,
  useSearchActivitiesForAssociationQuery
} from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { useToasterStore } from '@/store'
import { AvModal } from '@avenirs-esr/avenirs-dsav'
import isEmpty from 'lodash/isEmpty'
import { useI18n } from 'vue-i18n'

export interface AssociateActivitiesModalProps {
  show: boolean
  traceId: string
}

const { show, traceId } = defineProps<AssociateActivitiesModalProps>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'associated'): void
}>()

const { t } = useI18n()
const { addErrorMessage, addSuccessMessage } = useToasterStore()

const {
  searchQuery,
  selectedOptions: selectedActivityOptions,
  selectedAssociations,
  showConfirmModal,
  displayConfirmModal,
  hideConfirmModal,
  onSearch,
  onDeleteItem: onDeleteActivity,
  listenAndDisplayToastOnSearchError
} = useAssociationModal()

const {
  activities,
  isError: isSearchError,
  error: searchError,
  isLoading
} = useSearchActivitiesForAssociationQuery({
  traceId: computed(() => traceId),
  params: computed(() => ({
    keyword: searchQuery.value.trim() || undefined,
    page: 0,
    pageSize: 100,
  }))
})

listenAndDisplayToastOnSearchError(isSearchError, searchError)

const activityOptions = computed(() =>
  activities.value.filter(({ disabled }) => !disabled).map(activity => ({
    label: activity.title,
    value: activity.id,
  }))
)

const { mutate: associateTraceWithActivities, isPending } = useAssociateTraceWithActivitiesMutation({
  onError: (error: BaseApiException) => {
    addErrorMessage({
      title: t('global.error.generic'),
      description: error.message,
    })
  },
  onSuccess: (_, variables) => {
    const count = variables.associationsCreationRequest.idsToAssociate.length

    hideConfirmModal()

    addSuccessMessage({
      timeout: 2000,
      description: t(
        'student.traces.views.StudentTraceView.AssociateActivitiesModal.success',
        { count }
      ),
    })

    emit('associated')
  }
})

function onCancel () {
  selectedActivityOptions.value = []
  emit('cancel')
}

function onConfirm () {
  const associationsCreationRequest: AssociationsCreationRequest = {
    idsToAssociate: selectedAssociations.value.map(activity => activity.id),
  }

  associateTraceWithActivities({
    traceId,
    associationsCreationRequest
  })
}

function getActivityThematic (activityId: string): EActivityThematic | undefined {
  return activities.value.find(activity => activity.id === activityId)?.thematic
}

function getOptionLabel (option: { label: string, value: string | number }): string {
  return [option.label, getActivityThematic(option.value.toString())].join(' - ')
}
</script>

<template>
  <AvModal
    :opened="show"
    data-testid="associate-activities-modal"
    :close-button-label="t('global.buttons.cancel')"
    :confirm-button-label="t('student.traces.views.StudentTraceView.AssociateActivitiesModal.confirm', { count: selectedAssociations.length })"
    :confirm-button-disabled="isEmpty(selectedAssociations) || isPending"
    :confirm-button-icon="ICONS.ASSOCIATIONS"
    @close="onCancel"
    @confirm="displayConfirmModal"
  >
    <template #header>
      <div
        class="av-row av-justify-center"
        data-testid="header"
      >
        <span class="b2-regular av-text-text1">
          {{ t('student.traces.views.StudentTraceView.AssociateActivitiesModal.title') }}
        </span>
      </div>
    </template>

    <SearchAssociationLayout
      v-model="selectedActivityOptions"
      :options="activityOptions"
      :items="selectedAssociations"
      :input-options="{
        placeholder: t('student.traces.views.StudentTraceView.AssociateActivitiesModal.searchPlaceholder'),
      }"
      :get-option-key="option => option.value"
      :get-option-label="getOptionLabel"
      :loading="isLoading"
      @search="onSearch"
      @delete="onDeleteActivity"
    >
      <template #selectedItem="{ item }">
        <DeclaredActivityCompactCard
          :activity="{ ...item, thematic: getActivityThematic(item.id) }"
          class="av-w-full"
        />
      </template>
    </SearchAssociationLayout>
  </AvModal>

  <ConfirmAssociateModal
    :show="showConfirmModal"
    :title="t('student.traces.views.StudentTraceView.ConfirmAssociateActivitiesModal.title')"
    :items="selectedAssociations"
    @cancel="hideConfirmModal"
    @confirm="onConfirm"
  />
</template>
