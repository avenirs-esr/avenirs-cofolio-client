<script setup lang="ts">
import useToaster from '@/common/composables/use-toaster'
import { STUDENT_ABOUT_ROUTE, STUDENT_HOME_ROUTE, StudentNavigation } from '@/features/student'
import { AvHeader } from '@/ui'

const toaster = useToaster()

const serviceTitle = 'Student'
const serviceDescription = 'Student service'
const logoText = ['Ministère', 'de l’intérieur']

const quickLinks = [
  {
    label: 'Home',
    to: { name: STUDENT_HOME_ROUTE },
    icon: 'ri-home-4-line',
    iconAttrs: { color: 'var(--red-marianne-425-625)' },
  },
  {
    label: 'À propos',
    to: { name: STUDENT_ABOUT_ROUTE },
    icon: 'ri-question-mark',
    iconRight: true,
  },
]
const searchQuery = ref('')
</script>

<template>
  <AvHeader
    v-model="searchQuery"
    :service-title="serviceTitle"
    :service-description="serviceDescription"
    :logo-text="logoText"
    :quick-links="quickLinks"
    :home-to="{ name: STUDENT_HOME_ROUTE }"
    show-search
  >
    <template #mainnav>
      <StudentNavigation />
    </template>
  </AvHeader>

  <div class="fr-container  fr-mt-3w  fr-mt-md-5w  fr-mb-5w">
    <router-view />
  </div>

  <AppToaster
    :messages="toaster.messages"
    @close-message="toaster.removeMessage($event)"
  />
</template>
