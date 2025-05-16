<script setup lang="ts">
import type { DsfrHeaderProps } from '@gouvminint/vue-dsfr'
import { useLanguageSwitcher } from '@/common/composables/use-language-switcher'
import useToaster from '@/common/composables/use-toaster'
import { StudentMessagesModal, StudentNavigation, StudentNotificationsModal, StudentProfileModal } from '@/features/student'
import { studentHomeRoute } from '@/features/student/routes'
import { AvHeader, MDI_ICONS } from '@/ui'

const toaster = useToaster()
const { languageSelector, selectLanguage } = useLanguageSwitcher()

const serviceTitle = 'CoFolio Étudiant'

const mockedUserName = 'J. Moulin'
const mockedNotificationsCount = 2
const mockedMessageCount = 0

const searchQuery = ref('')

const showMessagesModal = ref(false)
function displayMessagesModal () {
  showMessagesModal.value = true
}
function hideMessagesModal () {
  showMessagesModal.value = false
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

const quickLinks: DsfrHeaderProps['quickLinks'] = [
  {
    label: 'Messagerie',
    to: '',
    icon: MDI_ICONS.CHAT_BUBBLE,
    button: true,
    onClick: ($event: MouseEvent) => {
      $event.preventDefault()
      displayMessagesModal()
    },
  },
  {
    label: 'Notifications',
    to: '',
    icon: mockedNotificationsCount > 0 ? MDI_ICONS.BELL_NOTIFICATION : MDI_ICONS.NOTIFICATIONS_NONE,
    button: true,
    onClick: ($event: MouseEvent) => {
      $event.preventDefault()
      displayNotificationsModal()
    },
  },
  {
    label: mockedUserName,
    to: '',
    icon: MDI_ICONS.ACCOUNT_CIRCLE,
    button: true,
    onClick: ($event: MouseEvent) => {
      $event.preventDefault()
      displayProfileModal()
    },
  },
]
</script>

<template>
  <AvHeader
    v-model="searchQuery"
    :service-title="serviceTitle"
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

  <StudentMessagesModal
    :messages-count="mockedMessageCount"
    :show-modal="showMessagesModal"
    :on-close="hideMessagesModal"
  />

  <StudentNotificationsModal
    :notification-count="mockedNotificationsCount"
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

  <AppToaster
    :messages="toaster.messages"
    @close-message="toaster.removeMessage($event)"
  />
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
