<script setup lang="ts">
import useToaster from '@/common/composables/use-toaster'
import { AvSkillCard } from '@/ui'
import StudentAppHeader from '../components/StudentAppHeader.vue'

const toaster = useToaster()
</script>

<template>
  <StudentAppHeader />

  <AvSkillCard title="Mettre en place des filières d’économies circulaires" />

  <div class="fr-container  fr-mt-3w  fr-mt-md-5w  fr-mb-5w">
    <router-view />
  </div>

  <AppToaster
    :messages="toaster.messages"
    @close-message="toaster.removeMessage($event)"
  />
</template>
