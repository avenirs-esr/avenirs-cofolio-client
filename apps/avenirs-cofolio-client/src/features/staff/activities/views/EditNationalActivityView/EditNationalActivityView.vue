<script setup lang="ts">
import type { ActivityDraftUpdateRequest, FileDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { AvTab, AvTabs, MDI_ICONS, RI_ICONS, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { BaseApiException, PageTitle, QuerySuspense, useApiErrors, useTaskLoading } from '@avenirs-esr/shared'
import {
  EActivityRight,
  EActivityStatus,
  invalidateGetActivityContent,
  invalidateGetActivityPresentation,
  useAddDraftFile,
  useDeleteDraftBanner,
  useDeleteDraftFile,
  useGetActivityContent,
  useGetActivityPresentation,
  useUpdateActivityDraft,
  useUploadDraftBanner
} from '@avenirs-esr/shared/api/avenir-esr'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'
import { getOverflowedParentActivityPeriod, getUncoveredSubActivitiesPeriod } from '@/common/activities/utils/activity-period'
import UpdateInProgressBadge from '@/common/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.vue'
import { useNavigation } from '@/common/composables'
import { useEnumRouteQuery } from '@/common/composables/use-enum-route-query/use-enum-route-query'
import { useQueueAutoSave } from '@/common/composables/use-queue-auto-save/use-queue-auto-save'
import { useSaveState } from '@/common/composables/use-save-state/use-save-state'
import { ROUTES } from '@/common/constants'
import { META_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'
import { isDifferentFile } from '@/common/utils/file/file'
import AddNationalActivitySideNavigation from '@/features/staff/activities/components/navigation/AddNationalActivitySideNavigation/AddNationalActivitySideNavigation.vue'
import { useEditNationalActivityFormValidators } from '@/features/staff/activities/composables/use-edit-national-activity-form-validators/use-edit-national-activity-form-validators'
import { ACTIVITY_AUTO_SAVE_DEBOUNCE, ACTIVITY_TRACE_SETTING_INFINITY_VALUE } from '@/features/staff/activities/config'
import { EditActivityTabIndex } from '@/features/staff/activities/editActivity.constants'
import { EditActivityFormDataBannerAction } from '@/features/staff/activities/types/forms.types'
import { toActivityAssessmentRequest } from '@/features/staff/activities/utils/activity-assessment'
import ActivityContentTab from '@/features/staff/activities/views/EditNationalActivityView/components/ActivityContentTab/ActivityContentTab.vue'
import ActivityPublicationTab from '@/features/staff/activities/views/EditNationalActivityView/components/ActivityPublicationTab/ActivityPublicationTab.vue'
import { useSubActivitiesOrder } from '@/features/staff/activities/views/EditNationalActivityView/composables/use-sub-activities-order/use-sub-activities-order'
import { provideEditNationalActivityViewContext } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityViewContext'
import { useToasterStore } from '@/store'

interface EditNationalActivityViewProps {
  id: string
}

const { id } = defineProps<EditNationalActivityViewProps>()

const { isMobile } = useAvBreakpoints()

const { t } = useI18n()
const {
  validateTitle,
  validateSummary,
  validateDescription,
  validateRecommendedCompletionContexts,
  validateFeedbackAllowedIterations,
  validateStartDate,
  validateEndDate,
  validatePeriodWithinParentActivity,
  validatePeriodCoversSubActivities,
  validateAssessmentGrade,
  validateAssessmentOptions,
} = useEditNationalActivityFormValidators()
const activeTab = useEnumRouteQuery('tab', EditActivityTabIndex, EditActivityTabIndex.CONTENT)
const { getErrorMessage } = useApiErrors()
const { addSuccessMessage, addErrorMessage } = useToasterStore()
const { navigateToStaffActivities } = useNavigation()
const { isLoading: isSavingForm, withTaskLoading } = useTaskLoading()
const queryClient = useQueryClient()

const activityId = computed(() => id)

const {
  data: content,
  isLoading: contentIsLoading,
  error: contentError
} = useGetActivityContent(EActivityStatus.DRAFT, activityId)
const {
  data: presentation,
  isLoading: presentationIsLoading,
  error: presentationError
} = useGetActivityPresentation(EActivityStatus.DRAFT, activityId)

const parentActivityId = computed(() => content.value?.mainActivityId ?? '')
const isSubActivity = computed(() => !!parentActivityId.value)

const {
  data: parentActivity,
  isLoading: isParentActivityLoading,
  error: parentActivityError
} = useGetActivityContent(EActivityStatus.DRAFT, parentActivityId, {
  query: {
    enabled: isSubActivity
  }
})

const isLoading = computed(() => contentIsLoading.value || presentationIsLoading.value || isParentActivityLoading.value)
const error = computed(() => contentError.value ?? presentationError.value ?? parentActivityError.value)

const isEditMode = computed(() => content.value?.createdAt !== content.value?.updatedAt)
const title = computed(() => t(`staff.global.navigation.tabs.activities.items.${isEditMode.value ? 'edit' : 'add'}.${isSubActivity.value ? 'subActivity' : 'nationalActivity'}`))

const trailingLinks = computed(() => [
  ...(parentActivity.value
    ? [
        {
          text: parentActivity.value.title,
          to: {
            name: ROUTES.STAFF.ACTIVITIES_EDIT_NATIONAL_ACTIVITY.name,
            params: { id: parentActivity.value.id }
          }
        },
        { text: t(META_BREADCRUMBS.STAFF.ACTIVITIES.SUB_ACTIVITIES.textKey) }
      ]
    : []),
  { text: content.value?.title ?? '' },
  { text: title.value }
])

const hasPublishRight = computed(() => content.value?.rights.includes(EActivityRight.PUBLISH) ?? false)

const remoteFiles = computed(() => content.value?.files ?? [])
const persistedTargetIds = computed(() => [...(content.value?.targetInstitutionIds ?? []), ...(content.value?.targetGroupIds ?? [])])
const subActivities = computed(() => content.value?.subActivities ?? [])

const defaultValues: EditActivityFormData = reactive({
  title: computed(() => content.value?.title ?? ''),
  thematic: computed(() => content.value?.thematic),
  description: computed(() => content.value?.description ?? ''),
  recommendedCompletionContexts: computed(() => content.value?.recommendedCompletionContexts ?? ''),
  startDate: computed(() => content.value?.startDate),
  endDate: computed(() => content.value?.endDate),
  summary: computed(() => content.value?.summary ?? ''),
  enableReflection: computed(() => content.value?.enableReflection ?? true),
  feedbackAllowedIterations: computed(() => content.value?.feedbackAllowedIterations ?? undefined),
  traceAllowedAssociations: computed(() => content.value?.traceAllowedAssociations ?? ACTIVITY_TRACE_SETTING_INFINITY_VALUE),
  bannerAction: EditActivityFormDataBannerAction.NONE,
  files: remoteFiles,
  links: computed(() => content.value?.links ?? []),
  isNational: computed(() => content.value?.national ?? false),
  assessmentComment: computed(() => content.value?.assessment?.comment ?? false),
  assessmentGrade: computed(() => content.value?.assessment?.grade),
  assessmentValidation: computed(() => content.value?.assessment?.validation ?? false),
  targetInstitutionIds: computed(() => content.value?.targetInstitutionIds ?? []),
  targetGroupIds: computed(() => content.value?.targetGroupIds ?? []),
})

const { mutateAsync: uploadBannerMutation } = useUploadDraftBanner()
const { mutateAsync: uploadResourceFileMutation } = useAddDraftFile()
const { mutateAsync: deleteBannerMutation } = useDeleteDraftBanner()
const { mutateAsync: deleteResourceFileMutation } = useDeleteDraftFile()
const { mutateAsync: updateActivity } = useUpdateActivityDraft()

const isExecutionPeriodEnabled = ref(false)
const isAssessmentEnabled = ref(false)
const isAssessmentGradeEnabled = ref(false)

const {
  queueAutoSave,
  cancelAutoSave,
  pendingAutoSaveData
} = useQueueAutoSave<ActivityDraftUpdateRequest>(save, ACTIVITY_AUTO_SAVE_DEBOUNCE)
const subActivitiesOrder = useSubActivitiesOrder(computed(() => id), subActivities)

const form = useForm({
  defaultValues,
  validators: {
    onChange ({ value }: { value: EditActivityFormData }) {
      return {
        fields: {
          endDate: isSubActivity.value
            ? parentActivity.value && validatePeriodWithinParentActivity(value, parentActivity.value)
            : validatePeriodCoversSubActivities(value, subActivities.value),
        }
      }
    },
    onSubmit ({ value }: { value: EditActivityFormData }) {
      return {
        fields: {
          title: validateTitle(value.title),
          summary: validateSummary(value.summary),
          description: validateDescription(value.description),
          recommendedCompletionContexts: validateRecommendedCompletionContexts(value.recommendedCompletionContexts),
          feedbackAllowedIterations: validateFeedbackAllowedIterations(value.feedbackAllowedIterations),
          startDate: isExecutionPeriodEnabled.value ? validateStartDate(value.startDate) : undefined,
          endDate: isExecutionPeriodEnabled.value ? validateEndDate({ startDate: value.startDate, endDate: value.endDate }) : undefined,
          assessmentGrade: isAssessmentEnabled.value ? validateAssessmentGrade(value.assessmentGrade, isAssessmentGradeEnabled.value) : undefined,
          assessmentValidation: isAssessmentEnabled.value ? validateAssessmentOptions(value, isAssessmentGradeEnabled.value) : undefined,
        }
      }
    }
  },
  onSubmit: async ({ value }: { value: EditActivityFormData }) => {
    cancelAutoSave()
    pendingAutoSaveData.value = {}

    const hasBothDates = !!value.startDate && !!value.endDate
    const periodDates = hasBothDates
      ? { startDate: value.startDate, endDate: value.endDate, enableCompletionPeriod: true }
      : { enableCompletionPeriod: false }

    await save({
      title: value.title,
      thematic: value.thematic,
      description: value.description,
      recommendedCompletionContexts: value.recommendedCompletionContexts,
      ...periodDates,
      summary: value.summary,
      enableReflection: value.enableReflection ?? true,
      feedbackAllowedIterations: value.feedbackAllowedIterations ?? 0,
      traceAllowedAssociations: value.traceAllowedAssociations,
      links: value.links,
      national: value.isNational,
      assessment: toActivityAssessmentRequest(value),
      targetInstitutionIds: value.targetInstitutionIds,
      targetGroupIds: value.targetGroupIds,
    })
  },
})

const {
  isSaving,
  isBusy,
  canSave,
  saveNow
} = useSaveState([
  {
    hasPendingChanges: form.useStore(state => state.isDirty),
    isSaving: isSavingForm,
    canSave: form.useStore(state => state.isDirty && state.isValid && !state.isValidating),
    saveNow: () => form.handleSubmit(),
  },
  subActivitiesOrder,
])

function normalizeError (error: unknown): string {
  if (error instanceof BaseApiException) {
    return getErrorMessage(error)
  }
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'Unknown'
}

function withoutRejectedPeriod (data: ActivityDraftUpdateRequest): ActivityDraftUpdateRequest | undefined {
  if (!data.enableCompletionPeriod || !data.startDate || !data.endDate) {
    return data
  }

  const rejectedPeriod = isSubActivity.value
    ? parentActivity.value && getOverflowedParentActivityPeriod(parentActivity.value, data.startDate, data.endDate)
    : getUncoveredSubActivitiesPeriod(subActivities.value, data.startDate, data.endDate)

  if (!rejectedPeriod) {
    return data
  }

  const { startDate, endDate, enableCompletionPeriod, ...otherData } = data
  return Object.keys(otherData).length > 0 ? otherData : undefined
}

const bannerFile = ref<File | null>(null)

async function saveBanner (action: EditActivityFormDataBannerAction) {
  switch (action) {
    case EditActivityFormDataBannerAction.DELETE:
      await deleteBannerMutation({ activityDraftId: id })
      break
    case EditActivityFormDataBannerAction.UPDATE:
      await uploadBannerMutation({
        activityDraftId: id,
        data: { file: bannerFile.value! }
      })
      bannerFile.value = null
      break
  }
}

async function saveResourceFiles (newFiles: File[], removedFiles: FileDTO[]) {
  await Promise.all([
    ...newFiles.map(file => uploadResourceFileMutation({
      activityDraftId: id,
      data: { file }
    })),
    ...removedFiles.map(file => deleteResourceFileMutation({
      activityDraftId: id,
      fileId: file.id
    }))
  ])
}

async function saveActivity (data: ActivityDraftUpdateRequest) {
  await updateActivity({
    activityDraftId: id,
    data,
  })
}

async function save (data?: ActivityDraftUpdateRequest) {
  const activityData = data && withoutRejectedPeriod(data)
  const promises: Promise<void>[] = []
  const bannerAction = form.getFieldValue('bannerAction')
  const files = form.getFieldValue('files')

  if (bannerAction !== EditActivityFormDataBannerAction.NONE) {
    promises.push(saveBanner(bannerAction))
    form.setFieldValue('bannerAction', EditActivityFormDataBannerAction.NONE)
  }

  const newFiles = files.filter(localFile => !defaultValues.files.some(remoteFile => !isDifferentFile(localFile, remoteFile))) as File[]
  const removedFiles = defaultValues.files.filter(remoteFile => !files.some(localFile => !isDifferentFile(remoteFile, localFile))) as FileDTO[]

  if (newFiles.length > 0 || removedFiles.length > 0) {
    promises.push(saveResourceFiles(newFiles, removedFiles))
    form.setFieldValue('files', defaultValues.files)
  }

  if (activityData) {
    promises.push(saveActivity(activityData))
  }

  if (promises.length === 0) {
    return
  }

  const results = await withTaskLoading(async () => {
    const settledResults = await Promise.allSettled(promises)

    if (settledResults.some(r => r.status === 'fulfilled')) {
      await invalidateGetActivityContent(queryClient, EActivityStatus.DRAFT, id)
      await invalidateGetActivityPresentation(queryClient, EActivityStatus.DRAFT, id)

      form.reset({
        ...form.state.values,
        files: remoteFiles.value,
        bannerAction: EditActivityFormDataBannerAction.NONE,
      })
      void form.validate('change')
    }

    return settledResults
  })
  const someFulfilled = results.some(r => r.status === 'fulfilled')

  if (results.every(r => r.status === 'fulfilled')) {
    addSuccessMessage(t('staff.activities.views.EditNationalActivityView.success.saveActivityContent'))
  }
  else {
    const errorMessages = results
      .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      .map(r => normalizeError(r.reason))
    const description = errorMessages.join(', ')

    if (someFulfilled) {
      addSuccessMessage({
        title: t('staff.activities.views.EditNationalActivityView.success.saveActivityContentWithErrors', { count: errorMessages.length }),
        description,
      })
    }
    else {
      addErrorMessage({
        title: t('staff.activities.views.EditNationalActivityView.errors.saveActivityContent', { count: errorMessages.length }),
        description,
      })
    }
  }
}

function onNextStep () {
  activeTab.value = EditActivityTabIndex.PUBLICATION
}

function onPublished () {
  navigateToStaffActivities(true)
}

provideEditNationalActivityViewContext({
  form,
  isSaving,
  isBusy,
  canSave,
  saveNow,
  isExecutionPeriodEnabled,
  isAssessmentEnabled,
  isAssessmentGradeEnabled,
  subActivitiesOrder,
  save,
  queueAutoSave
})
</script>

<template>
  <PageTitle
    :title="title"
    :trailing-links="trailingLinks"
  />
  <div class="av-col av-gap-sm">
    <UpdateInProgressBadge :show="isEditMode" />
    <QuerySuspense
      :is-loading
      :error
      :error-title="t('staff.activities.views.EditNationalActivityView.errors.fetchActivityContent')"
    >
      <div class="av-row av-w-full av-gap-xl">
        <AddNationalActivitySideNavigation
          v-if="!isMobile"
          :active-tab="activeTab"
          :is-sub-activity="isSubActivity"
        />
        <div class="av-col av-flex-fill">
          <AvTabs
            v-model="activeTab"
            data-testid="add-national-activity-tabs"
          >
            <AvTab
              :title="t('staff.activities.views.EditNationalActivityView.ActivityContentTab.title')"
              :icon="MDI_ICONS.PENCIL_OUTLINE"
              :disabled="activeTab !== EditActivityTabIndex.CONTENT && isBusy"
              :is-loading="activeTab === EditActivityTabIndex.CONTENT && isBusy"
              data-testid="activity-content-tab-item"
            >
              <ActivityContentTab
                :activity="content!"
                :is-sub-activity="isSubActivity"
                @next-step="onNextStep"
              />
            </AvTab>
            <AvTab
              :title="t('staff.activities.views.EditNationalActivityView.ActivityPublicationTab.title')"
              :icon="RI_ICONS.SEND_PLANE_LINE"
              :disabled="activeTab !== EditActivityTabIndex.PUBLICATION && isBusy"
              :is-loading="activeTab === EditActivityTabIndex.PUBLICATION && isBusy"
              data-testid="activity-publication-tab-item"
            >
              <ActivityPublicationTab
                v-model="bannerFile"
                :activity="presentation!"
                :persisted-target-ids="persistedTargetIds"
                :lock-persisted-targets="content?.hasEnrolledStudent"
                :has-publish-right="hasPublishRight"
                :is-sub-activity="isSubActivity"
                @published="onPublished"
              />
            </AvTab>
          </AvTabs>
        </div>
      </div>
    </QuerySuspense>
  </div>
</template>
