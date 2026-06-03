<script setup lang="ts">
import type { BaseApiException } from '@/common/exceptions'
import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import type { Ref } from 'vue'
import {
  type ActivityDraftUpdateRequest,
  EActivityStatus,
  EActivityThematic,
  invalidateGetActivityContent,
  useGetActivityContent,
  useUpdateActivity
} from '@/api/avenir-esr'
import { QuerySuspense } from '@/common/components'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useNavigation } from '@/common/composables'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { useEnumRouteQuery } from '@/common/composables/use-enum-route-query/use-enum-route-query'
import { ROUTES } from '@/common/constants'
import AddNationalActivitySideNavigation from '@/features/staff/activities/components/navigation/AddNationalActivitySideNavigation/AddNationalActivitySideNavigation.vue'
import { useEditNationalActivityFormValidators } from '@/features/staff/activities/composables/use-edit-national-activity-form-validators/use-edit-national-activity-form-validators'
import { ACTIVITY_TRACE_SETTING_INFINITY_VALUE } from '@/features/staff/activities/config'
import { EditActivityTabIndex } from '@/features/staff/activities/editActivity.constants'
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

const mode: Ref<string> = useRouteQuery('mode', 'edit')
const queryClient = useQueryClient()

const title = computed(() => t(`staff.global.navigation.tabs.activities.items.${mode.value === 'add' ? 'addNationalActivity' : 'editNationalActivity'}`))

const breadcrumbLinks = computed(() => [
  { text: t('staff.global.navigation.tabs.home'), to: ROUTES.STAFF.HOME },
  { text: t('staff.global.navigation.tabs.activities.header'), to: ROUTES.STAFF.ACTIVITIES },
  { text: title.value }
])

const { data: activity, isLoading, error } = useGetActivityContent(EActivityStatus.DRAFT, id)

const defaultValues: EditActivityFormData = reactive({
  title: computed(() => activity.value?.title ?? ''),
  thematic: computed(() => activity.value?.thematic ?? EActivityThematic.TRANSVERSAL),
  description: computed(() => activity.value?.description ?? ''),
  executionPeriodInfo: computed(() => activity.value?.executionPeriodInfo ?? ''),
  summary: computed(() => activity.value?.summary ?? ''),
  enableReflection: computed(() => activity.value?.enableReflection ?? true),
  feedbackAllowedIterations: computed(() => activity.value?.feedbackAllowedIterations ?? undefined),
  traceAllowedAssociations: computed(() => activity.value?.traceAllowedAssociations ?? ACTIVITY_TRACE_SETTING_INFINITY_VALUE),
})

const { mutate: updateActivity, isPending } = useUpdateActivity({
  mutation: {
    onSuccess: () => {
      invalidateGetActivityContent(queryClient, EActivityStatus.DRAFT, id)
      addSuccessMessage(t('staff.activities.views.EditNationalActivityView.success.saveActivityContent'))
    },
    onError: (error: BaseApiException) => {
      addErrorMessage({ title: t('staff.activities.views.EditNationalActivityView.errors.saveActivityContent'), description: getErrorMessage(error) })
    },
  },
})

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
  onSubmit: ({ value }) => {
    updateActivity({
      activityStatus: EActivityStatus.DRAFT,
      activityId: id,
      data: {
        title: value.title,
        thematic: value.thematic,
        description: value.description,
        executionPeriodInfo: value.executionPeriodInfo,
        summary: value.summary,
        enableReflection: value.enableReflection ?? true,
        feedbackAllowedIterations: value.feedbackAllowedIterations ?? 0,
        traceAllowedAssociations: value.traceAllowedAssociations,
      },
    })
  },
})

function save (data?: ActivityDraftUpdateRequest) {
  if (data) {
    updateActivity({
      activityStatus: EActivityStatus.DRAFT,
      activityId: id,
      data,
    })
    return
  }
  form.handleSubmit()
}

function cancel () {
  form.reset(defaultValues)
}

function onNextStep () {
  activeTab.value = EditActivityTabIndex.PUBLICATION
}

function onPublished () {
  navigateToStaffActivities(true)
}

watch(activity, () => {
  form.reset(defaultValues)
})

provideEditNationalActivityViewContext({ form, isUpdating: isPending, save, cancel })
</script>

<template>
  <PageTitle
    :title="title"
    :breadcrumb-links="breadcrumbLinks"
  />
  <QuerySuspense
    :is-loading="isLoading"
    :error="error"
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
            data-testid="activity-content-tab-item"
          >
            <ActivityContentTab
              :activity="activity!"
              @next-step="onNextStep"
            />
          </AvTab>
          <AvTab
            :title="t('staff.activities.views.EditNationalActivityView.ActivityPublicationTab.title')"
            :icon="RI_ICONS.SEND_PLANE_LINE"
            data-testid="activity-publication-tab-item"
          >
            <ActivityPublicationTab
              :activity="activity!"
              @published="onPublished"
            />
          </AvTab>
        </AvTabs>
      </div>
    </div>
  </QuerySuspense>
</template>
