<script setup lang="ts">
import type { DsfrHeaderProps } from '@gouvminint/vue-dsfr'
import { useLanguageSwitcher } from '@/common/composables/'
import {
  StudentMailboxModal,
  StudentNavigation,
  StudentNotificationsModal,
  StudentProfileModal
} from '@/features/student'
import { useStudentHeaderSummaryQuery } from '@/features/student/queries'
import { studentHomeRoute } from '@/features/student/routes'
import { AvHeader, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { languageSelector, selectLanguage } = useLanguageSwitcher()
const { data: headerSummary } = useStudentHeaderSummaryQuery()

const name = computed(() => headerSummary.value?.name ?? '')
const messagesCount = computed(() => headerSummary.value?.messagesCount ?? 0)
const notificationsCount = computed(() => headerSummary.value?.notificationsCount ?? 0)

const searchQuery = ref('')

const showMailboxModal = ref(false)
function displayMailboxModal () {
  showMailboxModal.value = true
}
function hideMailboxModal () {
  showMailboxModal.value = false
}

const showNotificationsModal = ref(false)
function displayNotificationsModal () {
  showNotificationsModal.value = true
}
function hideNotificationsModal () {
  showNotificationsModal.value = false
}

const showProfileModal = ref(false)
function displayProfileModal () {
  showProfileModal.value = true
}
function hideProfileModal () {
  showProfileModal.value = false
}

const quickLinks = computed<DsfrHeaderProps['quickLinks']>(() => [
  {
    label: t('student.layout.header.quicklinks.mailbox'),
    to: '',
    icon: MDI_ICONS.CHAT_BUBBLE,
    button: true,
    onClick: ($event: MouseEvent) => {
      $event.preventDefault()
      displayMailboxModal()
    },
  },
  {
    label: t('student.layout.header.quicklinks.notifications'),
    to: '',
    icon: notificationsCount.value > 0 ? MDI_ICONS.BELL_NOTIFICATION : MDI_ICONS.NOTIFICATIONS_NONE,
    button: true,
    onClick: ($event: MouseEvent) => {
      $event.preventDefault()
      displayNotificationsModal()
    },
  },
  {
    label: name.value,
    to: '',
    icon: MDI_ICONS.ACCOUNT_CIRCLE,
    button: true,
    onClick: ($event: MouseEvent) => {
      $event.preventDefault()
      displayProfileModal()
    },
  },
])

defineExpose({ searchQuery, showMailboxModal, showNotificationsModal, showProfileModal })
</script>

<template>
  <AvHeader
    v-model="searchQuery"
    :service-title="t('student.layout.header.serviceTitle')"
    :home-to="studentHomeRoute"
    show-search
    :quick-links="quickLinks"
    :language-selector="languageSelector"
    @language-select="selectLanguage($event)"
  >
    <template #mainnav>
      <StudentNavigation />
    </template>
  </AvHeader>

  <StudentMailboxModal
    :messages-count="messagesCount"
    :show-modal="showMailboxModal"
    :on-close="hideMailboxModal"
  />

  <StudentNotificationsModal
    :notifications-count="notificationsCount"
    :show-modal="showNotificationsModal"
    :on-close="hideNotificationsModal"
  />

  <StudentProfileModal
    :show-modal="showProfileModal"
    :on-close="hideProfileModal"
  />

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

:deep(.fr-header__menu-links > nav .fr-btns-group > li > .fr-btn) {
  padding-left: 0.5rem !important;
  padding-right: 0.5rem !important;
}
</style>
