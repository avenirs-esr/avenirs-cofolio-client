<script setup lang="ts">
import AvVIcon from '@/ui/base/AvVIcon/AvVIcon.vue'

/**
 * Props du composant AvIconText.
 */
interface AvIconTextProps {
  /**
   * La couleur du texte.
   * @default 'var(--text1)'
   */
  textColor?: string

  /**
   * La couleur de l'icône.
   * @default 'var(--text1)'
   */
  iconColor?: string

  /**
   * Le nom de l'icône suivant la nomenclature définie pour `VIcon` sur VueDSFR.
   */
  icon: string

  /**
   * Le texte à afficher.
   */
  text: string

  /**
   * La classe de typographie à utiliser pour le texte.
   * @default 'b2-regular'
   */
  typographyClass?: string

  /**
   * L'espace entre l'icône et le texte.
   * @default '0.25rem'
   */
  gap?: string

  /**
   * Si `false`, le texte trop long sera tronqué.
   * @default false
   */
  inline?: boolean
}

const {
  textColor = 'var(--text1)',
  iconColor = 'var(--text1)',
  icon,
  text,
  typographyClass = 'b2-regular',
  gap = '0.25rem',
  inline = false
} = defineProps<AvIconTextProps>()

const iconSize = computed(() => {
  if (typographyClass.startsWith('n') || typographyClass.startsWith('s')) {
    return 2
  }
  return 1.3125
})

const ellipsisContainerClass = computed(() => !inline ? 'ellipsis-container' : undefined)
const ellipsisClass = computed(() => !inline ? 'ellipsis' : undefined)
</script>

<template>
  <div
    class="icon-text--container"
    :class="[ellipsisContainerClass]"
  >
    <AvVIcon
      class="icon-text--icon"
      :name="icon"
      :color="iconColor"
      :size="iconSize"
    />
    <span
      class="icon-text--text"
      :class="[ellipsisClass, typographyClass]"
    >
      {{ text }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.icon-text--container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: v-bind('gap');
}

.icon-text--text {
  color: v-bind('textColor')
}

.icon-text--text {
  color: v-bind('textColor')
}
</style>
