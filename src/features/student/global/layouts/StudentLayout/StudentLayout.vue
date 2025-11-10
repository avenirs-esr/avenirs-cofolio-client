<script setup lang="ts">
import { Footer } from '@/common/components'
import SwitchUniverse from '@/common/components/SwitchUniverse/SwitchUniverse.vue'
import { useBaseApiExceptionToast, useInvalidateAllQueriesAfterLocaleChange } from '@/common/composables'
import StudentNavigation from '@/features/student/global/components/navigation/StudentNavigation/StudentNavigation.vue'
import { useStudentHeaderSummaryQuery, useStudentSummaryQuery } from '@/features/student/global/queries/use-student-summary.query/use-student-summary.query'
import { studentHomeRoute } from '@/features/student/routes'
import { StudentMailboxPopover, StudentNotificationsPopover, StudentProfilePopover } from '@/features/student/user'
import { useUserStore } from '@/store'
import { AvHeader } from '@avenirs-esr/avenirs-dsav'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

useInvalidateAllQueriesAfterLocaleChange()

const { t } = useI18n()

const { languageSelector, selectLanguage } = useUserStore()
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
    :service-title="t('student.layout.header.serviceTitle')"
    :home-to="studentHomeRoute"
    show-search
    :language-selector="languageSelector"
    @language-select="selectLanguage($event)"
  >
    <template #before-quick-links>
      <ul class="fr-btns-group">
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
    <div class="fr-container  fr-mt-3w  fr-mt-md-5w  fr-mb-5w">
      <router-view />
    </div>
  </main>

  <Footer />
</template>

<style lang="scss" scoped>
:deep(.fr-header__menu-links > nav .fr-nav__item > .fr-translate__btn) {
  padding-left: var(--spacing-xs) !important;
  padding-right: var(--spacing-xs) !important;
}

:deep(.fr-header__menu-links > .fr-btns-group > li > .av-popover-wrapper > .av-popover-trigger-wrapper > .fr-btn),
:deep(.fr-header__menu-links > nav .fr-btns-group > li > .fr-btn) {
  padding-left: var(--spacing-xs) !important;
  padding-right: var(--spacing-xs) !important;
}

:deep(.fr-btns-group .fr-btn) {
  margin-bottom: var(--spacing-none);
}
</style>
