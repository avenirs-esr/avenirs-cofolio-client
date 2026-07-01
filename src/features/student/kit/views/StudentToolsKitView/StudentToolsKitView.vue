<script lang="ts" setup>
import { EUserCategory, useGetProfile } from '@/api/avenir-esr'
import backgroundImg from '@/assets/student_tools_kit_intro_background.png'
import ProfileCard from '@/common/components/ProfileCard/ProfileCard.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useApiErrors } from '@/common/composables/use-api-errors/use-api-errors'
import { ROUTES } from '@/common/constants'
import { AvBreadcrumb } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { data: studentSummary, error, isLoading } = useGetProfile(EUserCategory.STUDENT)
const { getErrorMessage } = useApiErrors()

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.tools.header') },
  { text: t('student.global.navigation.tabs.tools.items.kit') },
])
</script>

<template>
  <div class="student-tools-kit av-col av-gap-lg">
    <div class="background-img">
      <img
        :src="backgroundImg"
        alt="background"
      >
    </div>
    <div class="content av-col av-gap-lg">
      <AvBreadcrumb
        :navigation-label="t('global.breadcrumb.ariaLabel')"
        :show-breadcrumb-label="t('global.breadcrumb.expandButtonLabel')"
        :links="breadcrumbLinks"
      />

      <div class="intro-container av-col av-align-center">
        <div class="text-container av-col av-gap-sm">
          <h1
            class="av-text-center"
            data-testid="kit-title"
          >
            {{ t('student.kit.views.StudentToolsKitView.title') }}
          </h1>
          <span
            class="s1-bold av-text-center"
            data-testid="kit-subtitle"
          >
            {{ t('student.kit.views.StudentToolsKitView.subtitle') }}
          </span>
          <span
            class="s1-bold av-text-center"
            data-testid="kit-consign"
          >
            {{ t('student.kit.views.StudentToolsKitView.consign') }}
          </span>
        </div>
      </div>

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
    </div>
  </div>
</template>

<style lang="scss" scoped>
.student-tools-kit {
  position: relative;

  .background-img {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .content {
    z-index: 1;
  }

  .text-container {
    width: 50%;
  }
}
</style>
