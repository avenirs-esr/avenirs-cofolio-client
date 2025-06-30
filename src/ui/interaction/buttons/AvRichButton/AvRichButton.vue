<script setup lang="ts">
import type { Slot } from 'vue'
import AvVIcon from '@/ui/base/AvVIcon/AvVIcon.vue'

/**
 * Props du composant AvRichButton.
 */
export interface AvRichButtonProps {
  /**
   * Étiquette textuelle du bouton.
   */
  label: string

  /**
   * Icône affichée à gauche dans le bouton.
   * Doit être un nom d'icône.
   */
  iconLeft?: string

  /**
   * Icône affichée à droite dans le bouton.
   * Doit être un nom d'icône.
   */
  iconRight?: string

  /**
   * Permet de modifier le padding du bouton.
   * @default '1rem'
   */
  customPadding?: string

  /**
   * Fonction appelée lors du clic sur le bouton.
   * @param event L'événement MouseEvent du clic.
   */
  onClick?: (event: MouseEvent) => void
}

const {
  label,
  iconLeft = undefined,
  iconRight = undefined,
  customPadding = '1rem',
  onClick
} = defineProps<AvRichButtonProps>()

/**
 * Slots disponibles dans le composant AvRichButton.
 *
 * @slot default - Slot par défaut pour le contenu du bouton riche.
 */
defineSlots<{
  /**
   * Slot par défaut pour le contenu du bouton riche.
   */
  default: Slot
}>()
</script>

<template>
  <button
    class="av-rich-button"
    :title="label"
    :aria-label="label"
    @click="onClick"
  >
    <div class="av-rich-button__line">
      <div class="av-rich-button__left">
        <AvVIcon
          v-if="iconLeft"
          :name="iconLeft"
          color="var(--dark-background-primary1)"
          :size="1.5"
        />
        <slot />
      </div>
      <AvVIcon
        v-if="iconRight"
        :name="iconRight"
        color="var(--dark-background-primary1)"
        :size="1.5"
      />
    </div>
  </button>
</template>

<style lang="scss" scoped>
.av-rich-button {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.75rem;
  border: 1px solid var(--stroke);
  overflow: hidden;
  padding: v-bind('customPadding');
}

.av-rich-button:hover {
  border: 1px solid var(--dark-background-primary1);
  box-shadow: 0 0 0 2px var(--dark-background-primary1);
}

.av-rich-button__line {
  display: flex;
  width: 100%;
  align-items: center;
  text-align: left;
}

.av-rich-button__left {
  flex: 1;
  overflow: hidden;
}
</style>
