<script lang="ts" setup>
import { EUserCategory, useGetProfile } from '@/api/avenir-esr'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import ProfileCard from '@/common/components/ProfileCard/ProfileCard.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import ExportKitButton from '@/features/student/kit/views/StudentToolsKitView/components/interaction/ExportKitButton/ExportKitButton.vue'
import KitContentTabs from '@/features/student/kit/views/StudentToolsKitView/components/KitContentTabs/KitContentTabs.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { data: studentSummary, error, isLoading } = useGetProfile(EUserCategory.STUDENT)
const { getErrorMessage } = useApiErrors()
</script>

<template>
  <PageTitle
    :title="t('student.kit.views.StudentToolsKitView.title')"
    :information-tooltip="t('student.kit.views.StudentToolsKitView.informationTooltip')"
  >
    <template #actions>
      <ExportKitButton />
    </template>
  </PageTitle>

  <div class="content av-col av-gap-lg">
    <QuerySuspense
      :error="error"
      :is-loading="isLoading"
      :error-title="t('student.kit.views.StudentToolsKitView.errors.profile')"
      :error-message="getErrorMessage(error)"
    >
      <ProfileCard
        :first-name="studentSummary!.firstname"
        :last-name="studentSummary!.lastname"
        :profile-picture-url="studentSummary!.profilePicture.url"
        :cover-picture-url="studentSummary!.coverPicture.url"
        :bio="studentSummary!.bio"
      />
    </QuerySuspense>

    <KitContentTabs />
  </div>
</template>
