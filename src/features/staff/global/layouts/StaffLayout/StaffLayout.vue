<script setup lang="ts">
import { EUserCategory, useGetQuickLinks } from '@/api/avenir-esr'
import Footer from '@/common/components/Footer/Footer.vue'
import MainContent from '@/common/components/MainContent/MainContent.vue'
import SkipLinks from '@/common/components/navigation/SkipLinks/SkipLinks.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import SwitchUniverse from '@/common/components/SwitchUniverse/SwitchUniverse.vue'
import { useBaseApiExceptionToast, useLanguageSwitcher } from '@/common/composables'
import { QUICK_LINKS_REFRESH_INTERVAL, ROUTES } from '@/common/constants'
import { useAuthStore } from '@/features/auth/global/stores/auth.store'
import StaffNavigation from '@/features/staff/global/components/navigation/StaffNavigation/StaffNavigation.vue'
import StaffNotificationsPopover from '@/features/staff/user/components/overlays/StaffNotificationsPopover/StaffNotificationsPopover.vue'
import StaffProfileDropdown from '@/features/staff/user/components/overlays/StaffProfileDropdown/StaffProfileDropdown.vue'
import { AvHeader } from '@avenirs-esr/avenirs-dsav'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { languageSelector, selectLanguage } = useLanguageSwitcher()

const searchQuery = ref('')
defineExpose({ searchQuery })

const { data, isPending, error } = useGetQuickLinks(EUserCategory.STAFF, {
  query: { refetchInterval: QUICK_LINKS_REFRESH_INTERVAL }
})
useBaseApiExceptionToast(error)

const name = computed(() => {
  const { firstname, lastname } = data.value!
  return `${capitalize(firstname[0])}. ${capitalize(lastname)}`
})
const { canSwitchProfile } = useAuthStore()
</script>

<template>
  <SkipLinks />

  <AvHeader
    v-model="searchQuery"
    :home-label="t('staff.global.layout.header.home')"
    :home-to="ROUTES.STAFF.HOME"
    :language-selector="languageSelector"
    :search-label="t('global.buttons.search')"
    :placeholder="`${t('global.buttons.search')}...`"
    :close-drawer-label="t('global.buttons.close')"
    @language-select="selectLanguage($event)"
  >
    <template #quickLinks>
      <QuerySuspense :is-loading="!data || isPending">
        <div class="av-px-sm av-pt-sm av-pb-sm">
          <ul class="av-row av-wrap av-gap-sm av-align-stretch av-list-reset">
            <li data-testid="notifications-button">
              <StaffNotificationsPopover />
            </li>
            <li data-testid="profile-button">
              <StaffProfileDropdown :username="name" />
            </li>
          </ul>
        </div>
      </QuerySuspense>
    </template>
    <template #mainnav>
      <StaffNavigation />
    </template>
    <template
      v-if="canSwitchProfile"
      #roleContext
    >
      <SwitchUniverse />
    </template>
  </AvHeader>

  <MainContent>
    <div class="av-container av-mt-md">
      <router-view />
    </div>
  </MainContent>

  <Footer
    :accessibility-link="ROUTES.STAFF.ACCESSIBILITY"
    :cookies-link="ROUTES.STAFF.COOKIES"
    :legal-link="ROUTES.STAFF.LEGAL"
    :personal-data-link="ROUTES.STAFF.PERSONAL_DATA"
  />
</template>
