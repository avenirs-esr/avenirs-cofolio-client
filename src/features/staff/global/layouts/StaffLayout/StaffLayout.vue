<script setup lang="ts">
import { AvHeader } from '@avenirs-esr/avenirs-dsav'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'
import { EUserCategory, useGetQuickLinks } from '@/api/avenir-esr'
import QuerySuspense from '@/common/components/feedback/QuerySuspense/QuerySuspense.vue'
import Footer from '@/common/components/Footer/Footer.vue'
import MainContent from '@/common/components/layout/MainContent/MainContent.vue'
import SkipLinks from '@/common/components/navigation/SkipLinks/SkipLinks.vue'
import SwitchUniverse from '@/common/components/navigation/SwitchUniverse/SwitchUniverse.vue'
import { useBaseApiExceptionToast, useLanguageSwitcher } from '@/common/composables'
import { QUICK_LINKS_REFRESH_INTERVAL, ROUTES } from '@/common/constants'
import { useMenuBurgerStore } from '@/common/stores/menu-burger.store'
import { useCurrentUser } from '@/features/auth/global/composables/use-current-user/use-current-user'
import StaffNavigation from '@/features/staff/global/components/navigation/StaffNavigation/StaffNavigation.vue'
import StaffNotificationsPopover from '@/features/staff/user/components/overlays/StaffNotificationsPopover/StaffNotificationsPopover.vue'
import StaffProfileDropdown from '@/features/staff/user/components/overlays/StaffProfileDropdown/StaffProfileDropdown.vue'

const { t } = useI18n()
const { languageSelector, selectLanguage } = useLanguageSwitcher()
const { profile: { canSwitch } } = useCurrentUser()
const menuBurgerStore = useMenuBurgerStore()
const { showMenuBurgerDrawer } = storeToRefs(menuBurgerStore)

const { data, isPending, error } = useGetQuickLinks(EUserCategory.STAFF, {
  query: { refetchInterval: QUICK_LINKS_REFRESH_INTERVAL }
})
useBaseApiExceptionToast(error)

const searchQuery = ref('')

const name = computed(() => {
  const { firstname, lastname } = data.value!
  return `${capitalize(firstname[0])}. ${capitalize(lastname)}`
})

defineExpose({ searchQuery })
</script>

<template>
  <SkipLinks />

  <AvHeader
    v-model="searchQuery"
    v-model:menu-open="showMenuBurgerDrawer"
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
      v-if="canSwitch"
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
    :cgu-link="ROUTES.STAFF.CGU"
    :cookies-link="ROUTES.STAFF.COOKIES"
    :personal-data-link="ROUTES.STAFF.PERSONAL_DATA"
  />
</template>
