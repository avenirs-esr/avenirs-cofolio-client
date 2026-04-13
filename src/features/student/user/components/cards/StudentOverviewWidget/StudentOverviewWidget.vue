<script setup lang="ts">
import { EUserCategory } from '@/api/avenir-esr'
import ProfileCard from '@/common/components/ProfileCard/ProfileCard.vue'
import { useBaseApiExceptionToast, useDrawer } from '@/common/composables'
import { useUserSummaryQuery } from '@/common/queries'
import UpdateProfileDrawer from '@/features/student/user/components/overlays/UpdateProfileDrawer/UpdateProfileDrawer.vue'
import { AvRichButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { data: studentSummary, error } = useUserSummaryQuery(EUserCategory.STUDENT)
useBaseApiExceptionToast(error)
const { t } = useI18n()
const { showDrawer, displayDrawer, hideDrawer } = useDrawer()
</script>

<template>
  <div
    v-if="studentSummary"
    data-testid="student-overview-widget"
  >
    <ProfileCard
      :first-name="studentSummary.firstname"
      :last-name="studentSummary.lastname"
      :profile-picture-url="studentSummary.profilePicture.url"
      :cover-picture-url="studentSummary.coverPicture.url"
      :bio="studentSummary.bio"
    >
      <div
        class="av-pt-sm"
        data-testid="student-overview-widget-actions"
      >
        <ul class="av-col av-gap-sm av-list-reset">
          <li>
            <AvRichButton
              class="av-rich-button--edit-profile"
              :label="t('student.user.cards.StudentOverviewWidget.buttons.editProfile')"
              :icon-right="MDI_ICONS.PENCIL_OUTLINE"
              data-testid="edit-profile-button"
              @click="displayDrawer"
            >
              <span class="b1-regular">{{ t('student.user.cards.StudentOverviewWidget.buttons.editProfile') }}</span>
            </AvRichButton>
          </li>
          <li class="demo-display-none">
            <AvRichButton
              class="av-rich-button--share-resume"
              :label="t('student.user.cards.StudentOverviewWidget.buttons.shareResume')"
              :icon-right="MDI_ICONS.FILE_ACCOUNT_OUTLINE"
              data-testid="share-resume-button"
            >
              <span class="b1-regular">{{ t('student.user.cards.StudentOverviewWidget.buttons.shareResume') }}</span>
            </AvRichButton>
          </li>
          <li class="demo-display-none">
            <AvRichButton
              class="av-rich-button--share-cofolio"
              :label="t('student.user.cards.StudentOverviewWidget.buttons.shareCofolio')"
              :icon-right="MDI_ICONS.SHARE_VARIANT_OUTLINE"
              data-testid="share-cofolio-button"
            >
              <span class="b1-regular">{{ t('student.user.cards.StudentOverviewWidget.buttons.shareCofolio') }}</span>
            </AvRichButton>
          </li>
          <li class="demo-display-none">
            <AvRichButton
              class="av-rich-button--establishments"
              :label="t('student.user.cards.StudentOverviewWidget.buttons.establishments')"
              :icon-right="MDI_ICONS.SWAP_HORIZONTAL"
              data-testid="my-establishments-button"
            >
              <span class="b1-regular">{{ t('student.user.cards.StudentOverviewWidget.buttons.establishments') }}</span>
            </AvRichButton>
          </li>
        </ul>
      </div>
    </ProfileCard>
  </div>
  <UpdateProfileDrawer
    v-if="studentSummary"
    :key="showDrawer ? 'drawer-open' : 'drawer-closed'"
    :student-summary="studentSummary"
    :show="showDrawer"
    :on-close="hideDrawer"
  />
</template>
