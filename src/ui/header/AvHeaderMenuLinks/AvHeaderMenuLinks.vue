<!-- This code is an adaptation of the source code of DsfrHeaderMenuLinks available at:
 https://vue-ds.fr/composants/DsfrHeaderMenuLinks -->

<script lang="ts" setup>
import type { VIcon } from '@gouvminint/vue-dsfr'
import AvButton from '@/ui/interaction/buttons/AvButton/AvButton.vue'

/**
 * Props du composant AvHeaderMenuLinks.
 */
interface AvHeaderMenuLinksProps {
  /**
   * Un tableau d'objets représentant les liens rapides.
   * Chaque lien peut avoir une icône, un label et une fonction onClick.
   */
  links?: {
    /**
     * Nom de l'icône (string) ou objet de props d'un composant VIcon.
     */
    icon?: string | InstanceType<typeof VIcon>['$props']

    /**
     * Label du lien.
     */
    label?: string

    /**
     * Fonction appelée lors du clic sur le lien.
     * @param event L'événement MouseEvent du clic.
     */
    onClick?: ($event: MouseEvent) => void
  }[]

  /**
   * Label ARIA pour la navigation, utile pour l'accessibilité.
   * @default 'Menu secondaire'
   */
  navAriaLabel?: string
}

withDefaults(defineProps<AvHeaderMenuLinksProps>(), {
  navAriaLabel: 'Menu secondaire',
})

/**
 * Événements émis par AvHeaderMenuLinks.
 */
const emit = defineEmits<{
  /**
   * Événement déclenché lors du clic sur un lien.
   * @event linkClick
   * @param event L'événement MouseEvent du clic.
   */
  linkClick: [event: MouseEvent]
}>()
</script>

<template>
  <nav
    role="navigation"
    :aria-label="navAriaLabel"
  >
    <ul
      class="fr-btns-group"
    >
      <li
        v-for="(quickLink, index) in links"
        :key="index"
      >
        <AvButton
          :icon="quickLink.icon"
          :label="quickLink.label ?? ''"
          :on-click="($event: MouseEvent) => {
            emit('linkClick', $event)
            quickLink.onClick?.($event)
          }"
        />
      </li>
    </ul>
  </nav>
</template>
