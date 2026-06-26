<script setup lang="ts">
import { EUserCategory, useGetProfile } from '@/api/avenir-esr'
import UpdateProfileDrawer from '@/common/components/overlay/drawers/UpdateProfileDrawer/UpdateProfileDrawer.vue'
import ProfileCard from '@/common/components/ProfileCard/ProfileCard.vue'
import { useBaseApiExceptionToast, useDrawer } from '@/common/composables'
import { AvRichButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { data: studentSummary, error } = useGetProfile(EUserCategory.STUDENT)
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
        </ul>
      </div>
    </ProfileCard>
  </div>
  <UpdateProfileDrawer
    v-if="studentSummary"
    :key="showDrawer ? 'drawer-open' : 'drawer-closed'"
    v-bind="studentSummary"
    :show="showDrawer"
    :on-close="hideDrawer"
  />
</template>
