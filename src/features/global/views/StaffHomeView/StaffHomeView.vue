<script setup lang="ts">
import { EUserCategory, useGetProfile } from '@/api/avenir-esr'
import UpdateProfileDrawer from '@/common/components/overlay/drawers/UpdateProfileDrawer/UpdateProfileDrawer.vue'
import ProfileCard from '@/common/components/ProfileCard/ProfileCard.vue'
import { useDrawer } from '@/common/composables/use-drawer/use-drawer'
import ActivitiesWidget from '@/features/global/views/StaffHomeView/components/ActivitiesWidget/ActivitiesWidget.vue'
import FeedbacksWidget from '@/features/global/views/StaffHomeView/components/FeedbacksWidget/FeedbacksWidget.vue'
import { AvRichButton, MDI_ICONS, useGlobalBackgroundColor } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

useGlobalBackgroundColor('var(--surface-background)')
const { t } = useI18n()
const { showDrawer, displayDrawer, hideDrawer } = useDrawer()

const { data: staffSummary } = useGetProfile(EUserCategory.STAFF)
</script>

<template>
  <h1 class="av-sr-only">
    {{ t('staff.global.layout.header.home') }}
  </h1>
  <div class="layout-home av-row av-wrap av-nowrap--md av-justify-center--md av-gap-xl av-align-start">
    <div class="layout-home__sidebar av-col av-gap-xl av-sticky--md av-top-sm">
      <div data-testid="staff-overview-widget">
        <ProfileCard
          v-if="staffSummary"
          :first-name="staffSummary.firstname"
          :last-name="staffSummary.lastname"
          :profile-picture-url="staffSummary.profilePicture.url"
          :cover-picture-url="staffSummary.coverPicture.url"
        >
          <div
            class="av-pt-sm"
            data-testid="staff-overview-widget-actions"
          >
            <ul class="av-col av-gap-sm av-list-reset">
              <li>
                <AvRichButton
                  :label="t('staff.global.views.StaffHomeView.buttons.editProfile')"
                  :icon-right="MDI_ICONS.PENCIL_OUTLINE"
                  data-testid="edit-profile-button"
                  @click="displayDrawer"
                >
                  <span class="b1-regular">{{ t('staff.global.views.StaffHomeView.buttons.editProfile') }}</span>
                </AvRichButton>
              </li>
            </ul>
          </div>
        </ProfileCard>
      </div>
    </div>
    <div class="layout-home__main av-col av-gap-xl">
      <FeedbacksWidget />
      <ActivitiesWidget is-draft />
      <ActivitiesWidget />
    </div>
  </div>

  <UpdateProfileDrawer
    v-if="staffSummary"
    :key="showDrawer ? 'drawer-open' : 'drawer-closed'"
    v-bind="staffSummary"
    :show="showDrawer"
    :on-close="hideDrawer"
  />
</template>

<style lang="scss" scoped>
@use '@avenirs-esr/avenirs-dsav/mixins' as dsav;

.layout-home {
  &__sidebar, &__main {
    flex: 1 1 100%;
    max-width: 100%;
  }

  @include dsav.min-width(md) {
    &__sidebar {
      flex: 0 1 400px;
      min-width: 300px;
    }

    &__main {
      flex: 1 1 300px;
      min-width: 300px;
    }
  }
}
</style>
