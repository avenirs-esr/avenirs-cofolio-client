<script setup lang="ts">
import { EUserCategory, useGetProfile } from '@/api/avenir-esr'
import Footer from '@/common/components/Footer/Footer.vue'
import SwitchUniverse from '@/common/components/SwitchUniverse/SwitchUniverse.vue'
import { useBaseApiExceptionToast, useLanguageSwitcher } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import StaffNavigation from '@/features/staff/global/components/navigation/StaffNavigation/StaffNavigation.vue'
import StaffProfilePopover from '@/features/staff/user/components/overlays/StaffProfilePopover/StaffProfilePopover.vue'
import { AvHeader } from '@avenirs-esr/avenirs-dsav'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { languageSelector, selectLanguage } = useLanguageSwitcher()

const searchQuery = ref('')

defineExpose({ searchQuery })

const { data: staffSummary, error: staffSummaryError } = useGetProfile(EUserCategory.STAFF)
useBaseApiExceptionToast(staffSummaryError)

const name = computed(() => {
  if (!staffSummary.value) {
    return ''
  }

  const { firstname, lastname } = staffSummary.value
  return `${capitalize(firstname[0])}. ${capitalize(lastname)}`
})
</script>

<template>
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
    <template #before-quick-links>
      <div class="av-px-sm av-pt-sm av-pb-sm">
        <ul class="av-row av-wrap av-gap-sm av-align-stretch av-list-reset">
          <li data-testid="profile-button">
            <StaffProfilePopover :username="name" />
          </li>
        </ul>
      </div>
    </template>
    <template #mainnav>
      <StaffNavigation />
    </template>
    <template #roleContext>
      <SwitchUniverse />
    </template>
  </AvHeader>

  <main>
    <div class="av-container av-mt-md">
      <router-view />
    </div>
  </main>

  <Footer
    :accessibility-link="ROUTES.STAFF.ACCESSIBILITY"
    :cookies-link="ROUTES.STAFF.COOKIES"
    :legal-link="ROUTES.STAFF.LEGAL"
    :personal-data-link="ROUTES.STAFF.PERSONAL_DATA"
  />
</template>
