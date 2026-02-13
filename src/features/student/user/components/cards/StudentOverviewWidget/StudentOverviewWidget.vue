<script setup lang="ts">
import { useBaseApiExceptionToast, useDrawer } from '@/common/composables'
import ProfileCard from '@/features/student/user/components/cards/ProfileCard/ProfileCard.vue'
import UpdateProfileDrawer from '@/features/student/user/components/overlays/UpdateProfileDrawer/UpdateProfileDrawer.vue'
import { useStudentSummaryQuery } from '@/features/student/user/queries/use-student-profile/use-student-profile.query'
import { AvRichButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { data: studentSummary, error } = useStudentSummaryQuery()
useBaseApiExceptionToast(error)
const { t } = useI18n()
const { showDrawer, displayDrawer, hideDrawer } = useDrawer()
</script>

<template>
  <div
    v-if="studentSummary"
    data-testid="student-overview-widget"
  >
    <ProfileCard :student-summary="studentSummary">
      <template #footer>
        <div class="av-pt-sm">
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
      </template>
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
