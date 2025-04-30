<script setup lang="ts">
import { AvButton, AvHeader } from '@/ui'
import { RI_ICONS } from '@/utils'
import { computed, ref } from 'vue'
import StudentNavigation from './StudentNavigation.vue'

const currentRole = ref('student')

const quickLinksNonAuthenticated = [
  {
    label: 'Se connecter',
    to: '/connexion',
    icon: RI_ICONS.LOCK,
  },
  {
    label: 'S\'enregistrer',
    to: '/inscription',
    icon: RI_ICONS.ACCOUNT_CIRCLE,
  },
]

const quickLinksStudent = [
  {
    label: 'Messagerie',
    to: '/messagerie',
    icon: RI_ICONS.CHAT,
  },
  {
    label: 'Notifications',
    to: '/notifications',
    icon: RI_ICONS.NOTIFICATION_FILL,
  },
  {
    label: 'J. Moulin',
    to: '/profil',
    icon: RI_ICONS.ACCOUNT_CIRCLE,
  },
]
const isAuthenticated = true // TODO: temps
const quickLinksToRender = computed(() => {
  if (isAuthenticated) {
    return currentRole.value === 'teacher' ? quickLinksNonAuthenticated : quickLinksStudent
  }
  return quickLinksStudent
})

const userRoleToRender = computed(() => {
  return currentRole.value === 'teacher' ? 'Enseignant' : 'Étudiant'
})

function onClick () {
  if (currentRole.value === 'teacher') {
    currentRole.value = 'student'
  }
  else {
    currentRole.value = 'teacher'
  }
}
</script>

<template>
  <DsfrHeader
    show-search
    :logo-text="['Ministère', 'de l\'enseignement', 'supérieur', 'et de la recherche']"
    placeholder="Chercher une compétence, une preuve, etc..."
    home-to="/"
    :quick-links="quickLinksToRender"
    search-label="Recherche"
    quick-links-aria-label="Menu secondaire"
    show-search-label="Recherche"
  >
    <template #mainnav>
      <StudentNavigation />
    </template>
    <div style="display: flex; flex-direction: row; align-items: center; gap: 16px">
      <div>
        <img
          src="@/assets/cofolio-logo.png"
          alt="CoFolio"
        >
      </div>
      <div
        style="display: flex; flex-direction: column"
        class="fr-header__service"
      >
        <p class="fr-header__service-title">
          CoFolio {{ userRoleToRender }}
        </p>
        <AvButton
          label="CHANGER D'UNIVERS"
          :icon="RI_ICONS.ARROW_LEFT_RIGHT"
          variant="tertiary-no-outline"
          :on-click
        />
      </div>
    </div>
  </DsfrHeader>
</template>

<style lang="scss" scoped></style>
