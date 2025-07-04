<!-- This code is an adaptation of the source code of DsfrHeaderMenuLinks available at:
 https://vue-ds.fr/composants/DsfrHeaderMenuLinks -->

<script lang="ts" setup>
import type { VIcon } from '@gouvminint/vue-dsfr'
import AvButton from '@/ui/interaction/buttons/AvButton/AvButton.vue'

/**
 * AvHeaderMenuLinks component props.
 */
interface AvHeaderMenuLinksProps {
  /**
   * An array of objects representing quick links.
   * Each link can have an icon, a label, and an onClick function.
   */
  links?: {
    /**
     * Icon name (string) or props object for a VIcon component.
     */
    icon?: string | InstanceType<typeof VIcon>['$props']

    /**
     * Link label.
     */
    label?: string

    /**
     * Function called when the link is clicked.
     * @param event The MouseEvent of the click.
     */
    onClick?: ($event: MouseEvent) => void
  }[]

  /**
   * ARIA label for navigation, useful for accessibility.
   * @default 'Menu secondaire'
   */
  navAriaLabel?: string
}

withDefaults(defineProps<AvHeaderMenuLinksProps>(), {
  navAriaLabel: 'Menu secondaire',
})

/**
 * Events triggered by AvHeaderMenuLinks.
 */
const emit = defineEmits<{
  /**
   * Event triggered when a link is clicked.
   * @event linkClick
   * @param event The MouseEvent of the click.
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
