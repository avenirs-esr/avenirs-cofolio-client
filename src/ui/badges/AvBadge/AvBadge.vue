<script setup lang="ts">
/**
 * Props du composant AvBadge.
 */
interface AvBadgeProps {
  /**
   * La couleur du texte à afficher dans le badge.
   */
  color: string

  /**
   * La couleur de fond du badge.
   */
  backgroundColor: string

  /**
   * La couleur de la bordure du badge.
   */
  borderColor?: string

  /**
   * Le lien vers l'icône publique au projet (ex: `/assets/icons/calendar-clock-outline.svg`).
   */
  iconPath?: string

  /**
   * Le texte à afficher dans le badge.
   */
  label: string

  /**
   * Définit le type de badge.
   * @default 'info'
   */
  type?: 'success' | 'error' | 'new' | 'info' | 'warning' | undefined

  /**
   * Si `true`, le badge s'affiche sans icône.
   * @default false
   */
  noIcon?: boolean | undefined

  /**
   * Si `true`, affiche un badge de taille réduite.
   * @default false
   */
  small?: boolean | undefined

  /**
   * Si `true`, le texte est tronqué avec des points de suspension s'il est trop long.
   * @default false
   */
  ellipsis?: boolean | undefined
}

const props = defineProps<AvBadgeProps>()

const customIconClass = computed(() => props.iconPath ? 'av-badge--customIcon' : undefined)
const styleVars = computed(() => ({
  '--icon-path': `url(${props.iconPath})`,
}))

const color = ref(props.color)
const backgroundColor = ref(props.backgroundColor)
</script>

<template>
  <DsfrBadge
    v-bind="props"
    class="av-badge"
    :class="[customIconClass]"
    :style="styleVars"
  />
</template>

<style lang="scss" scoped>
.av-badge {
  color: v-bind('color');
  background-color: v-bind('backgroundColor');
  border: 1px solid v-bind('borderColor');
}

.av-badge--customIcon::before {
  content: '';
  margin-right: 0.5rem;
  height: 1rem;
  width: 1rem;
  mask: var(--icon-path) !important;
  mask-size: contain !important;
  mask-repeat: no-repeat;
  mask-position: center;
  background-color: currentColor !important;
}
</style>
