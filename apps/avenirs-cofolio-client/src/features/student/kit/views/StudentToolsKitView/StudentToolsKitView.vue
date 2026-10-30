<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import ProfileCard from '@/common/components/cards/ProfileCard/ProfileCard.vue'
import QuerySuspense from '@/common/components/feedback/QuerySuspense/QuerySuspense.vue'
import PageTitle from '@/common/components/navigation/PageTitle/PageTitle.vue'
import { useCurrentUser } from '@/features/auth/global/composables/use-current-user/use-current-user'
import ExportKitButton from '@/features/student/kit/views/StudentToolsKitView/components/interaction/ExportKitButton/ExportKitButton.vue'
import KitContentTabs from '@/features/student/kit/views/StudentToolsKitView/components/KitContentTabs/KitContentTabs.vue'

const { t } = useI18n()
const { profile: { isLoading, data } } = useCurrentUser()
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
    <QuerySuspense :is-loading="isLoading">
      <ProfileCard
        :first-name="data.firstname"
        :last-name="data.lastname"
        :profile-picture="data.profilePicture"
        :cover-picture="data.coverPicture"
        :bio="data.bio"
      />
    </QuerySuspense>

    <KitContentTabs />
  </div>
</template>
