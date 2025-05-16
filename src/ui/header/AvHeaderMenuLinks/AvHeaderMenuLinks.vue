<!-- This code is an adaptation of the source code of DsfrHeaderMenuLinks available at:
 https://vue-ds.fr/composants/DsfrHeaderMenuLinks -->

<script lang="ts" setup>
import type { AvHeaderMenuLinksProps } from './AvHeaderMenuLinks.types'
import { AvButton } from '@/ui/interaction'

withDefaults(defineProps<AvHeaderMenuLinksProps>(), {
  links: () => [],
  navAriaLabel: 'Menu secondaire',
})

const emit = defineEmits<{ linkClick: [event: MouseEvent] }>()
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
          :label="quickLink.label"
          :on-click="($event: MouseEvent) => { emit('linkClick', $event); quickLink.onClick?.($event) }"
        />
      </li>
    </ul>
  </nav>
</template>
