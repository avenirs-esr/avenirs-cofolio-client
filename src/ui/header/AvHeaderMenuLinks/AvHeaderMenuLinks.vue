<!-- This code is an adaptation of the source code of DsfrHeaderMenuLinks available at:
 https://vue-ds.fr/composants/DsfrHeaderMenuLinks -->

<script lang="ts" setup>
import type { DsfrHeaderMenuLinkProps } from '@gouvminint/vue-dsfr'
import { AvButton } from '@/ui'

export interface AvHeaderMenuLinksProps {
  links?: Pick<DsfrHeaderMenuLinkProps, 'label' | 'icon' | 'onClick'>[]
  navAriaLabel?: string
}

withDefaults(defineProps<AvHeaderMenuLinksProps>(), {
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
