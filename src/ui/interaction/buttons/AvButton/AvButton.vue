<script setup lang="ts">
import type { VIcon } from '@gouvminint/vue-dsfr'
import { MDI_ICONS } from '@/ui/tokens/icons'

/**
 * Props du composant AvButton.
 */
export interface AvButtonProps {
  /**
   * Variant du bouton : sans bordure (`DEFAULT`) ou avec bordure (`OUTLINED`).
   * @default 'DEFAULT'
   */
  variant?: 'DEFAULT' | 'OUTLINED'

  /**
   * Thème du bouton : bleu (`PRIMARY`) ou gris (`SECONDARY`).
   * @default 'PRIMARY'
   */
  theme?: 'PRIMARY' | 'SECONDARY'

  /**
   * Indique un état de chargement du bouton.
   * @default false
   */
  isLoading?: boolean

  /**
   * Permet de modifier manuellement la taille de l'icône.
   * Si non défini, la taille est automatiquement calculée.
   */
  iconScale?: number

  /**
   * Permet de retirer les radius de la bordure du bouton.
   * @default false
   */
  noRadius?: boolean

  /**
   * Indique si le bouton est désactivé.
   * @default false
   */
  disabled?: boolean

  /**
   * Étiquette textuelle du bouton.
   */
  label: string

  /**
   * Indique la position de l'icône :
   * à gauche (`false`) ou à droite (`true`).
   * @default false
   */
  iconRight?: boolean

  /**
   * Permet de masquer le texte du label (`true`) ou de l'afficher (`false`).
   * @default false
   */
  iconOnly?: boolean

  /**
   * Taille du bouton : 'sm', 'small', 'md', 'medium', 'lg', 'large' ou vide.
   * @default 'md'
   */
  size?: 'sm' | 'small' | 'lg' | 'large' | 'md' | 'medium' | '' | undefined

  /**
   * Icône à afficher dans le bouton. Peut être un nom ou une configuration d'icône.
   */
  icon?: string | InstanceType<typeof VIcon>['$props']

  /**
   * Fonction appelée lors du clic sur le bouton.
   * @param event L'événement MouseEvent du clic.
   */
  onClick?: ($event: MouseEvent) => void
}

const props = withDefaults(defineProps<AvButtonProps>(), {
  variant: 'DEFAULT',
  theme: 'PRIMARY',
  size: 'md',
  iconOnly: false,
  iconRight: false,
  disabled: false,
  isLoading: false,
  noRadius: false
})

const loadingIcon: InstanceType<typeof VIcon>['$props'] = { name: MDI_ICONS.LOADING_OUTLINE, animation: 'spin' }
const iconToRender = computed(() => props.isLoading ? loadingIcon : props.icon)
const variantClass = computed(() => `av-button--variant-${props.variant.toLowerCase()}`)
const themeClass = computed(() => `av-button--theme-${props.theme.toLowerCase()}`)
const radiusClass = computed(() => props.noRadius ? 'av-button--no-radius' : '')

const computedSvgScale = computed(() => {
  if (props.iconScale && !Number.isNaN(props.iconScale)) {
    return props.iconScale
  }
  switch (props.size) {
    case 'small':
    case 'sm':
      return 1
    case 'medium':
    case 'md':
      return 1.5
    case 'large':
    case 'lg':
      return 2
    default:
      return 1.5
  }
})

defineExpose({ computedSvgScale })
</script>

<template>
  <DsfrButton
    v-bind="props"
    class="av-button"
    :class="[variantClass, themeClass, radiusClass]"
    :disabled="props.disabled || isLoading"
    :icon="iconToRender"
    :no-outline="props.variant === 'DEFAULT'"
    :tertiary="true"
    :aria-label="props.label"
    :title="props.label"
  />
</template>

<style lang="scss" scoped>
:deep(svg) {
  scale: v-bind('computedSvgScale');
}

.av-button--variant-default.av-button--theme-primary {
  background-color: var(--other-background-base);
  color: var(--dark-background-primary1) !important;
}

.av-button--variant-outlined.av-button--theme-primary {
  background-color: var(--other-background-base);
  color: var(--dark-background-primary1) !important;
  border: 1px solid var(--dark-background-primary1) !important;
}

.av-button--variant-default.av-button--theme-secondary {
  background-color: var(--other-background-base);
  color: var(--text1) !important;
}

.av-button--variant-outlined.av-button--theme-secondary {
  background-color: var(--other-background-base);
  color: var(--text1) !important;
  border: 1px solid var(--text1) !important;
}

.av-button--theme-primary:hover {
  background-color: var(--dark-background-primary1) !important;
  color: var(--other-background-base) !important;
}

.av-button--theme-secondary:hover {
  background-color: var(--light-background-neutral) !important;
}

.fr-btn.av-button--no-radius {
  border-radius: 0 !important;
}
</style>
