<script setup lang="ts">
import { AvHeader } from '@avenirs-esr/avenirs-dsav'
import { MainContent } from '@avenirs-esr/shared'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'
import { EUserCategory, useGetQuickLinks } from '@/api/avenir-esr'
import MainNavigation from '@/components/navigation/MainNavigation/MainNavigation.vue'
import SkipLinks from '@/components/navigation/SkipLinks/SkipLinks.vue'
import QuerySuspense from '@/components/QuerySuspense/QuerySuspense.vue'
import { useBaseApiExceptionToast, useLanguageSwitcher } from '@/composables'
import { QUICK_LINKS_REFRESH_INTERVAL, ROUTES } from '@/constants'

const { t } = useI18n()
const { languageSelector, selectLanguage } = useLanguageSwitcher()

const { data, isPending, error } = useGetQuickLinks(EUserCategory.STAFF, {
  query: { refetchInterval: QUICK_LINKS_REFRESH_INTERVAL }
})
useBaseApiExceptionToast(error)

const name = computed(() => {
  const { firstname, lastname } = data.value!
  return `${capitalize(firstname[0])}. ${capitalize(lastname)}`
})
</script>

<template>
  <SkipLinks />

  <AvHeader
    :home-label="t('global.MainNavigation.home')"
    :home-to="ROUTES.HOME"
    :language-selector="languageSelector"
    :close-drawer-label="t('global.buttons.close')"
    @language-select="selectLanguage($event)"
  >
    <template #quickLinks>
      <QuerySuspense :is-loading="!data || isPending">
        <div class="av-px-sm av-pt-sm av-pb-sm">
          <ul class="av-row av-wrap av-gap-sm av-align-stretch av-list-reset">
            <li data-testid="profile-button">
              {{ name }}
            </li>
          </ul>
        </div>
      </QuerySuspense>
    </template>
    <template #mainnav>
      <MainNavigation />
    </template>
  </AvHeader>

  <MainContent>
    <div class="av-container av-mt-md">
      <router-view />
    </div>
  </MainContent>
</template>
