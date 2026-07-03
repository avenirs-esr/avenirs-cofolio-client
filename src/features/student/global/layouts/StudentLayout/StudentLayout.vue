<script setup lang="ts">
import { EUserCategory, useGetQuickLinks } from '@/api/avenir-esr'
import Footer from '@/common/components/Footer/Footer.vue'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import SwitchUniverse from '@/common/components/SwitchUniverse/SwitchUniverse.vue'
import { useBaseApiExceptionToast, useInvalidateAllQueriesAfterLocaleChange } from '@/common/composables'
import { QUICK_LINKS_REFRESH_INTERVAL, ROUTES } from '@/common/constants'
import StudentNavigation from '@/features/student/global/components/navigation/StudentNavigation/StudentNavigation.vue'
import {
  StudentMailboxPopover,
  StudentNotificationsPopover,
  StudentProfileDropdown,
  useStudentUserStore
} from '@/features/student/user'
import { AvHeader } from '@avenirs-esr/avenirs-dsav'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

useInvalidateAllQueriesAfterLocaleChange()

const { languageSelector, selectLanguage } = useStudentUserStore()

const { data, isPending, error } = useGetQuickLinks(EUserCategory.STUDENT, {
  query: { refetchInterval: QUICK_LINKS_REFRESH_INTERVAL }
})
useBaseApiExceptionToast(error)

const name = computed(() => {
  const { firstname, lastname } = data.value!
  return `${capitalize(firstname[0])}. ${capitalize(lastname)}`
})

const messagesCount = 0 // TODO: waiting for mailbox implementation

const searchQuery = ref('')

defineExpose({ searchQuery })
</script>

<template>
  <AvHeader
    v-model="searchQuery"
    :home-label="t('student.global.layout.header.home')"
    :home-to="{ name: ROUTES.STUDENT.HOME.name }"
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
            <li
              class="demo-display-none"
              data-testid="mailbox-button"
            >
              <StudentMailboxPopover :messages-count="messagesCount" />
            </li>
            <li data-testid="notifications-button">
              <StudentNotificationsPopover />
            </li>
            <li data-testid="profile-button">
              <StudentProfileDropdown :username="name" />
            </li>
          </ul>
        </div>
      </QuerySuspense>
    </template>
    <template #mainnav>
      <StudentNavigation />
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
    :accessibility-link="ROUTES.STUDENT.ACCESSIBILITY"
    :cookies-link="ROUTES.STUDENT.COOKIES"
    :legal-link="ROUTES.STUDENT.LEGAL"
    :personal-data-link="ROUTES.STUDENT.PERSONAL_DATA"
  />
</template>
