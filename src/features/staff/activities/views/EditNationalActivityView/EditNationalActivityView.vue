<script setup lang="ts">
import type { BaseApiException } from '@/common/exceptions'
import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import type { Ref } from 'vue'
import { EActivityStatus, invalidateGetActivityContent, useGetActivityContent, useUpdateActivity } from '@/api/avenir-esr'
import { QuerySuspense } from '@/common/components'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import ActivityContentTab from '@/features/staff/activities/views/EditNationalActivityView/components/ActivityContentTab/ActivityContentTab.vue'
import { provideEditNationalActivityViewContext } from '@/features/staff/activities/views/EditNationalActivityView/EditNationalActivityViewContext'
import { useToasterStore } from '@/store'
import { useForm } from '@tanstack/vue-form'
import { useQueryClient } from '@tanstack/vue-query'
import { useRouteQuery } from '@vueuse/router'
import { useI18n } from 'vue-i18n'

interface EditNationalActivityViewProps {
  id: string
}

const { id } = defineProps<EditNationalActivityViewProps>()

const { t } = useI18n()
const { addSuccessMessage, addErrorMessage } = useToasterStore()

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
})

const { mutate: updateActivity } = useUpdateActivity({
  mutation: {
    onSuccess: () => {
      invalidateGetActivityContent(queryClient, EActivityStatus.DRAFT, id)
      addSuccessMessage(t('staff.activities.views.EditNationalActivityView.success.saveActivityContent'))
    },
    onError: (error: BaseApiException) => {
      addErrorMessage({ title: t('staff.activities.views.EditNationalActivityView.errors.saveActivityContent'), description: error.message })
    },
  },
})

const form = useForm({
  defaultValues,
  onSubmit: ({ value }) => {
    updateActivity({
      activityStatus: EActivityStatus.DRAFT,
      activityId: id,
      data: { title: value.title },
    })
  },
})

function save () {
  form.handleSubmit()
}

function cancel () {
  form.reset(defaultValues)
}

watch(activity, () => {
  form.reset(defaultValues)
})

provideEditNationalActivityViewContext({ form, save, cancel })
</script>

<template>
  <PageTitle
    :title="title"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTES.STAFF.ACTIVITIES"
  />
  <QuerySuspense
    :is-loading="isLoading"
    :error="error"
    :error-title="t('staff.activities.views.EditNationalActivityView.errors.fetchActivityContent')"
  >
    <ActivityContentTab :activity="activity!" />
  </QuerySuspense>
</template>
