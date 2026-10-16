<script setup lang="ts">
import { AvRichButton, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import ProfileCard from '@/common/components/cards/ProfileCard/ProfileCard.vue'
import UpdateProfileDrawer from '@/common/components/overlay/drawers/UpdateProfileDrawer/UpdateProfileDrawer.vue'
import { useDrawer } from '@/common/composables'
import { useCurrentUser } from '@/features/auth/global/composables/use-current-user/use-current-user'

const { t } = useI18n()
const { isProfileLoading, profile } = useCurrentUser()
const { showDrawer, displayDrawer, hideDrawer } = useDrawer()
</script>

<template>
  <div
    v-if="!isProfileLoading"
    id="overview-widget"
    data-testid="student-overview-widget"
  >
    <ProfileCard
      :first-name="profile.firstname"
      :last-name="profile.lastname"
      :profile-picture-url="profile.profilePicture.url"
      :cover-picture-url="profile.coverPicture.url"
      :bio="profile.bio"
    >
      <div
        class="av-pt-sm"
        data-testid="student-overview-widget-actions"
      >
        <ul class="av-col av-gap-sm av-list-reset">
          <li>
            <AvRichButton
              id="update-profile-button"
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
    v-if="!isProfileLoading"
    :key="showDrawer ? 'drawer-open' : 'drawer-closed'"
    v-bind="profile"
    :show="showDrawer"
    :on-close="hideDrawer"
  />
</template>
