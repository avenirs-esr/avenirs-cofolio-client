<script lang="ts" setup>
import type { Slot } from 'vue'

/**
 * Props du composant AvTab.
 * Ce composant est uniquement destiné à être utilisé comme enfant de AvTabs.
 */
interface AvTabProps {
  /**
   * Titre de l'onglet affiché dans la barre des onglets.
   */
  title: string

  /**
   * Icône de l'onglet
   */
  icon?: string
}

defineProps<AvTabProps>()

/**
 * Slots disponibles dans le composant AvTab.
 * Le slot par défaut contient le contenu de l'onglet.
 */
defineSlots<{
  /**
   * Slot par défaut pour le contenu de l'onglet.
   */
  default?: Slot
}>()
</script>

<template>
  <slot />
</template>
