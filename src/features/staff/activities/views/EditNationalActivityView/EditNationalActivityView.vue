<script setup lang="ts">
import type { Ref } from 'vue'
import {
  type ActivityDraftUpdateRequest,
  EActivityStatus,
  EActivityThematic,
  type FileDTO,
  invalidateGetActivityContent,
  invalidateGetActivityPresentation,
  useAddDraftFile,
  useDeleteDraftBanner,
  useDeleteDraftFile,
  useGetActivityContent,
  useGetActivityPresentation,
  useUpdateActivityDraft,
  useUploadDraftBanner,
} from '@/api/avenir-esr'
import { QuerySuspense } from '@/common/components'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useNavigation } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useEnumRouteQuery } from '@/common/composables/use-enum-route-query/use-enum-route-query'
import { useQueueAutoSave } from '@/common/composables/use-queue-auto-save/use-queue-auto-save'
import { useTaskLoading } from '@/common/composables/use-task-loading/use-task-loading'
import { ROUTES } from '@/common/constants'
import { BaseApiException } from '@/common/exceptions'
import { isDifferentFile } from '@/common/utils/file/file'
import AddNationalActivitySideNavigation from '@/features/staff/activities/components/navigation/AddNationalActivitySideNavigation/AddNationalActivitySideNavigation.vue'
import { useEditNationalActivityFormValidators } from '@/features/staff/activities/composables/use-edit-national-activity-form-validators/use-edit-national-activity-form-validators'
import { ACTIVITY_AUTO_SAVE_DEBOUNCE, ACTIVITY_TRACE_SETTING_INFINITY_VALUE } from '@/features/staff/activities/config'
import { EditActivityTabIndex } from '@/features/staff/activities/editActivity.constants'
import { type EditActivityFormData, EditActivityFormDataBannerAction } from '@/features/staff/activities/types/forms.types'
import ActivityContentTab from '@/features/staff/activities/views/EditNationalActivityView/components/ActivityContentTab/ActivityContentTab.vue'
import ActivityPublicationTab from '@/features/staff/activities/views/EditNationalActivityView/components/ActivityPublicationTab/ActivityPublicationTab.vue'
import { provideEditNationalActivityViewContext } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityViewContext'
import { useToasterStore } from '@/store'
import { AvTab, AvTabs, MDI_ICONS, RI_ICONS, useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { useRouteQuery } from '@vueuse/router'
import { useI18n } from 'vue-i18n'

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
  validateExecutionPeriodInfo,
  validateFeedbackAllowedIterations
} = useEditNationalActivityFormValidators()
const activeTab = useEnumRouteQuery('tab', EditActivityTabIndex, EditActivityTabIndex.CONTENT)
const { getErrorMessage } = useApiErrors()
const { addSuccessMessage, addErrorMessage } = useToasterStore()
const { navigateToStaffActivities } = useNavigation()
const { isLoading, withTaskLoading } = useTaskLoading()

const mode: Ref<string> = useRouteQuery('mode', 'edit')
const queryClient = useQueryClient()

const title = computed(() => t(`staff.global.navigation.tabs.activities.items.${mode.value === 'add' ? 'addNationalActivity' : 'editNationalActivity'}`))

const breadcrumbLinks = computed(() => [
  { text: t('staff.global.navigation.tabs.home'), to: ROUTES.STAFF.HOME },
  { text: t('staff.global.navigation.tabs.activities.header'), to: ROUTES.STAFF.ACTIVITIES },
  { text: title.value }
])

const {
  data: content,
  isLoading: contentIsLoading,
  error: contentError
} = useGetActivityContent(EActivityStatus.DRAFT, id)
const {
  data: presentation,
  isLoading: presentationIsLoading,
  error: presentationError
} = useGetActivityPresentation(EActivityStatus.DRAFT, id)

const remoteFiles = computed(() => content.value?.files ?? [])

const defaultValues: EditActivityFormData = reactive({
  title: computed(() => content.value?.title ?? ''),
  thematic: computed(() => content.value?.thematic ?? EActivityThematic.TRANSVERSAL),
  description: computed(() => content.value?.description ?? ''),
  executionPeriodInfo: computed(() => content.value?.executionPeriodInfo ?? ''),
  summary: computed(() => content.value?.summary ?? ''),
  enableReflection: computed(() => content.value?.enableReflection ?? true),
  feedbackAllowedIterations: computed(() => content.value?.feedbackAllowedIterations ?? undefined),
  traceAllowedAssociations: computed(() => content.value?.traceAllowedAssociations ?? ACTIVITY_TRACE_SETTING_INFINITY_VALUE),
  bannerAction: EditActivityFormDataBannerAction.NONE,
  files: remoteFiles,
  links: computed(() => content.value?.links ?? []),
})

const { mutateAsync: uploadBannerMutation } = useUploadDraftBanner()
const { mutateAsync: uploadResourceFileMutation } = useAddDraftFile()
const { mutateAsync: deleteBannerMutation } = useDeleteDraftBanner()
const { mutateAsync: deleteResourceFileMutation } = useDeleteDraftFile()
const { mutateAsync: updateActivity } = useUpdateActivityDraft()

const {
  queueAutoSave,
  cancelAutoSave,
  pendingAutoSaveData
} = useQueueAutoSave<ActivityDraftUpdateRequest>(save, ACTIVITY_AUTO_SAVE_DEBOUNCE)

const form = useForm({
  defaultValues,
  validators: {
    onSubmit ({ value }: { value: EditActivityFormData }) {
      return {
        fields: {
          title: validateTitle(value.title),
          summary: validateSummary(value.summary),
          description: validateDescription(value.description),
          executionPeriodInfo: validateExecutionPeriodInfo(value.executionPeriodInfo),
          feedbackAllowedIterations: validateFeedbackAllowedIterations(value.feedbackAllowedIterations),
        }
      }
    }
  },
  onSubmit: async ({ value }: { value: EditActivityFormData }) => {
    cancelAutoSave()
    pendingAutoSaveData.value = {}
    await save({
      title: value.title,
      thematic: value.thematic,
      description: value.description,
      executionPeriodInfo: value.executionPeriodInfo,
      summary: value.summary,
      enableReflection: value.enableReflection ?? true,
      feedbackAllowedIterations: value.feedbackAllowedIterations ?? 0,
      traceAllowedAssociations: value.traceAllowedAssociations,
      links: value.links,
    })
  },
})

const isFormDirty = form.useStore(s => s.isDirty)
const isUpdating = computed(() => contentIsLoading.value || presentationIsLoading.value || isLoading.value)
const savePending = computed(() => isFormDirty.value || isUpdating.value)

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
    newFiles.forEach(file => uploadResourceFileMutation({
      activityDraftId: id,
      data: { file }
    })),
    removedFiles.forEach(file => deleteResourceFileMutation({
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
  const promises: Promise<void>[] = []
  const bannerAction = form.getFieldValue('bannerAction')
  const files = form.getFieldValue('files')

  if (bannerAction !== EditActivityFormDataBannerAction.NONE) {
    promises.push(saveBanner(bannerAction))
    form.setFieldValue('bannerAction', EditActivityFormDataBannerAction.NONE)
  }

  const newFiles = files.filter(localFile => !defaultValues.files.some(remoteFile => !isDifferentFile(localFile, remoteFile))) as File[]
  const removedFiles = defaultValues.files.filter(remoteFile => !defaultValues.files.some(localFile => !isDifferentFile(remoteFile, localFile))) as FileDTO[]

  if (newFiles.length > 0 || removedFiles.length > 0) {
    promises.push(saveResourceFiles(newFiles, removedFiles))
    form.setFieldValue('files', defaultValues.files)
  }

  if (data) {
    promises.push(saveActivity(data))
  }

  if (promises.length === 0) {
    return
  }

  const results = await withTaskLoading(() => Promise.allSettled(promises))
  const someFulfilled = results.some(r => r.status === 'fulfilled')

  if (someFulfilled) {
    await invalidateGetActivityContent(queryClient, EActivityStatus.DRAFT, id)
    await invalidateGetActivityPresentation(queryClient, EActivityStatus.DRAFT, id)
  }

  if (results.every(r => r.status === 'fulfilled')) {
    form.reset({
      ...form.state.values,
      bannerAction: EditActivityFormDataBannerAction.NONE,
    })
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

provideEditNationalActivityViewContext({ form, isUpdating, save, queueAutoSave })
</script>

<template>
  <PageTitle
    :title="title"
    :breadcrumb-links="breadcrumbLinks"
  />
  <QuerySuspense
    :is-loading="contentIsLoading || presentationIsLoading"
    :error="contentError ?? presentationError"
    :error-title="t('staff.activities.views.EditNationalActivityView.errors.fetchActivityContent')"
  >
    <div class="av-row av-w-full av-gap-xl">
      <AddNationalActivitySideNavigation
        v-if="!isMobile"
        :active-tab="activeTab"
      />
      <div class="av-col av-flex-fill">
        <AvTabs
          v-model="activeTab"
          data-testid="add-national-activity-tabs"
        >
          <AvTab
            :title="t('staff.activities.views.EditNationalActivityView.ActivityContentTab.title')"
            :icon="MDI_ICONS.PENCIL_OUTLINE"
            :disabled="activeTab !== EditActivityTabIndex.CONTENT && savePending"
            :is-loading="activeTab === EditActivityTabIndex.CONTENT && savePending"
            data-testid="activity-content-tab-item"
          >
            <ActivityContentTab
              :activity="content!"
              @next-step="onNextStep"
            />
          </AvTab>
          <AvTab
            :title="t('staff.activities.views.EditNationalActivityView.ActivityPublicationTab.title')"
            :icon="RI_ICONS.SEND_PLANE_LINE"
            :disabled="activeTab !== EditActivityTabIndex.PUBLICATION && savePending"
            :is-loading="activeTab === EditActivityTabIndex.PUBLICATION && savePending"
            data-testid="activity-publication-tab-item"
          >
            <ActivityPublicationTab
              v-model="bannerFile"
              :activity="presentation!"
              @published="onPublished"
            />
          </AvTab>
        </AvTabs>
      </div>
    </div>
  </QuerySuspense>
</template>
