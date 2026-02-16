<script setup lang="ts">
import Footer from '@/common/components/Footer/Footer.vue'
import SwitchUniverse from '@/common/components/SwitchUniverse/SwitchUniverse.vue'
import { useBaseApiExceptionToast, useInvalidateAllQueriesAfterLocaleChange } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import StudentNavigation from '@/features/student/global/components/navigation/StudentNavigation/StudentNavigation.vue'
import {
  StudentMailboxPopover,
  StudentNotificationsPopover,
  StudentProfilePopover,
  useStudentSummaryQuery,
  useStudentUserStore
} from '@/features/student/user'
import { AvHeader } from '@avenirs-esr/avenirs-dsav'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

useInvalidateAllQueriesAfterLocaleChange()

const { t } = useI18n()

const { languageSelector, selectLanguage } = useStudentUserStore()
const { data: studentSummary, error: studentSummaryError } = useStudentSummaryQuery()
useBaseApiExceptionToast(studentSummaryError)

const name = computed(() => {
  if (!studentSummary.value) {
    return ''
  }
  const { firstname, lastname } = studentSummary.value
  return `${capitalize(firstname[0])}. ${capitalize(lastname)}`
})
const messagesCount = 0 // TODO: waiting for mailbox implementation
const notificationsCount = 0 // TODO: waiting for notifications implementation

const searchQuery = ref('')

defineExpose({ searchQuery })
</script>

<template>
  <AvHeader
    v-model="searchQuery"
    :service-title="t('student.global.layout.header.serviceTitle')"
    :home-to="{ name: ROUTES.STUDENT.HOME.name }"
    show-search
    :language-selector="languageSelector"
    @language-select="selectLanguage($event)"
  >
    <template #before-quick-links>
      <div class="av-px-sm av-pt-sm av-pb-sm">
        <ul class="av-row av-wrap av-gap-sm av-align-stretch av-list-reset">
          <li
            class="demo-display-none"
            data-testid="mailbox-button"
          >
            <StudentMailboxPopover :messages-count="messagesCount" />
          </li>
          <li
            class="demo-display-none"
            data-testid="notifications-button"
          >
            <StudentNotificationsPopover :notifications-count="notificationsCount" />
          </li>
          <li data-testid="profile-button">
            <StudentProfilePopover :username="name" />
          </li>
        </ul>
      </div>
    </template>
    <template #mainnav>
      <StudentNavigation />
    </template>
    <template #serviceDescription>
      <SwitchUniverse />
    </template>
  </AvHeader>

  <main>
    <div class="av-container av-mt-md">
      <router-view />
    </div>
  </main>

  <Footer />
</template>

<style lang="scss" scoped></style>
