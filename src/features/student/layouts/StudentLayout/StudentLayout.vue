<script setup lang="ts">
import { useBaseApiExceptionToast, useLanguageSwitcher } from '@/common/composables/'
import {
  StudentMailboxPopover,
  StudentNavigation,
  StudentNotificationsPopover,
  StudentProfilePopover
} from '@/features/student'
import { useStudentHeaderSummaryQuery } from '@/features/student/queries'
import { studentHomeRoute } from '@/features/student/routes'
import { AvHeader } from '@/ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { languageSelector, selectLanguage } = useLanguageSwitcher()
const { data: headerSummary, error } = useStudentHeaderSummaryQuery()
useBaseApiExceptionToast(error)

const name = computed(() => headerSummary.value?.name ?? '')
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
        <li>
          <StudentMailboxPopover :messages-count="messagesCount" />
        </li>
        <li>
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
  </AvHeader>

  <main>
    <div class="fr-container  fr-mt-3w  fr-mt-md-5w  fr-mb-5w">
      <router-view />
    </div>
  </main>
</template>

<style lang="scss" scoped>
:deep(.fr-header__menu-links > nav .fr-nav__item > .fr-translate__btn) {
  padding-left: 0.5rem !important;
  padding-right: 0.5rem !important;
}

:deep(.fr-header__menu-links > .fr-btns-group > li > .av-popover-wrapper > .av-popover-trigger-wrapper > .fr-btn),
:deep(.fr-header__menu-links > nav .fr-btns-group > li > .fr-btn) {
  padding-left: 0.5rem !important;
  padding-right: 0.5rem !important;
}

:deep(.fr-btns-group .fr-btn) {
  margin-bottom: 0;
}
</style>
