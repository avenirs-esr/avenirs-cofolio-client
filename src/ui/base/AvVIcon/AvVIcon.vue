<script setup lang="ts">
/**
 * Props du composant AvVIcon.
 */
interface AvVIconProps {
  /**
   * La taille du conteneur de l'icône ainsi qu'un ratio pour le scale de l'icône.
   * @default 1
   */
  size?: number

  /**
   * Le nom de l'icône à afficher.
   */
  name: string

  /**
   * Alignement vertical de l'icône par rapport à la ligne de base.
   * @default '-0.2em'
   */
  verticalAlign?: string

  /**
   * Type d'animation appliqué à l'icône.
   * Peut être 'spin', 'wrench', 'pulse', 'spin-pulse', 'flash' ou 'float'.
   */
  animation?: 'spin' | 'wrench' | 'pulse' | 'spin-pulse' | 'flash' | 'float'

  /**
   * Vitesse de l'animation si elle est définie.
   * Peut être 'fast' ou 'slow'.
   */
  speed?: 'fast' | 'slow'

  /**
   * Inverse l'icône horizontalement, verticalement ou les deux.
   */
  flip?: 'horizontal' | 'vertical' | 'both'

  /**
   * Étiquette ARIA pour l'accessibilité.
   */
  label?: string

  /**
   * Titre de l'icône (balise `<title>`), utilisé pour l'accessibilité et les info-bulles.
   */
  title?: string

  /**
   * Couleur principale de l'icône.
   */
  color?: string

  /**
   * Applique une couleur inversée à l'icône.
   * @default false
   */
  inverse?: boolean

  /**
   * Active le rendu côté serveur (Server-Side Rendering).
   * @default true
   */
  ssr?: boolean
}

const { size: propSize = 1, ...props } = defineProps<AvVIconProps>()

const VICON_SCALE_REM_RATIO = 16 / 19.19
const scale = computed(() => VICON_SCALE_REM_RATIO * propSize)
const size = computed(() => `${propSize}rem`)
</script>

<template>
  <div class="av-icon-vicon--container">
    <VIcon
      v-bind="props"
      :scale="scale"
    />
  </div>
</template>

<style lang="scss" scoped>
.av-icon-vicon--container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: v-bind('size');
  height: v-bind('size');
}
</style>
