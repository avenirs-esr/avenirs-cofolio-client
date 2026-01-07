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
  useStudentHeaderSummaryQuery,
  useStudentSummaryQuery,
  useStudentUserStore
} from '@/features/student/user'
import { AvHeader } from '@avenirs-esr/avenirs-dsav'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

useInvalidateAllQueriesAfterLocaleChange()

const { t } = useI18n()

const { languageSelector, selectLanguage } = useStudentUserStore()
const { data: headerSummary, error: studentHeaderSummaryError } = useStudentHeaderSummaryQuery()
const { data: studentSummary, error: studentSummaryError } = useStudentSummaryQuery()
useBaseApiExceptionToast(studentHeaderSummaryError)
useBaseApiExceptionToast(studentSummaryError)

const name = computed(() => {
  if (!studentSummary.value) {
    return ''
  }
  const { firstname, lastname } = studentSummary.value
  return `${capitalize(firstname[0])}. ${capitalize(lastname)}`
})
const messagesCount = computed(() => headerSummary.value?.messagesCount ?? 0)
const notificationsCount = computed(() => headerSummary.value?.notificationsCount ?? 0)

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
      <ul class="av-row av-wrap av-gap-sm av-align-stretch av-px-sm av-py-xxs">
        <li class="demo-display-none">
          <StudentMailboxPopover :messages-count="messagesCount" />
        </li>
        <li class="demo-display-none">
          <StudentNotificationsPopover :notifications-count="notificationsCount" />
        </li>
        <li>
          <StudentProfilePopover :username="name" />
        </li>
      </ul>
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
