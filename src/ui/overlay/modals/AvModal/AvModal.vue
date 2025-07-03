<script setup lang="ts">
import type { Slot } from 'vue'
import { AvButton, type AvButtonProps } from '@/ui/interaction'
import { MDI_ICONS } from '@/ui/tokens/icons'
import { useI18n } from 'vue-i18n'

/**
 * Propriétés configurant le composant AvModal.
 */
export interface AvModalProps {
  /**
   * Variant du bouton de fermeture : sans bordure (`DEFAULT`) ou avec bordure (`OUTLINED`).
   * @default 'DEFAULT'
   */
  closeButtonVariant?: AvButtonProps['variant']

  /**
   * Identifiant unique pour la modale.
   * @default useRandomId('modal', 'dialog')
   */
  modalId?: string

  /**
   * Indique si la modale est ouverte.
   * @default false
   */
  opened?: boolean

  /**
   * Spécifie si la modale est une alerte (rôle `"alertdialog"` si `true`) ou non (le rôle sera `"dialog"`).
   * @default false
   */
  isAlert?: boolean

  /**
   * Référence à l'élément d'origine pour redonner le focus après fermeture.
   * @default { focus() {} }
   */
  origin?: {
    focus: () => void
  }

  /**
   * Nom de l'icône à afficher dans le titre de la modale.
   */
  icon?: string

  /**
   * Taille de la modale.
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl'

  /**
   * Label et titre (pour l'accessibilité) du bouton de fermeture.
   */
  closeButtonLabel?: string
}

const props = defineProps<AvModalProps>()

/**
 * Événements émis par le composant.
 *
 * @event close - Événement émis lorsque la modale est fermée.
 */
const emit = defineEmits<{
  (e: 'close'): void
}>()

/**
 * Slots disponibles dans le composant.
 *
 * @slot default - Slot par défaut pour le contenu de la modale.
 * @slot header - Slot pour le titre de la modale.
 * @slot footer - Slot pour la zone de pied de la modale.
 */
defineSlots<{
  default?: Slot
  header?: Slot
  footer?: Slot
}>()

const { t } = useI18n()

const closeButtonLabel = computed(() => props.closeButtonLabel ?? t('global.buttons.close'))
const closeButtonVariant = computed(() => props.closeButtonVariant ?? 'DEFAULT')
</script>

<template>
  <DsfrModal
    v-bind="props"
    title=""
  >
    <template #default>
      <div class="av-modal__header">
        <slot name="header" />
      </div>
      <slot />
    </template>
    <template #footer>
      <div class="footer">
        <AvButton
          :icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
          :label="closeButtonLabel"
          :title="closeButtonLabel"
          :variant="closeButtonVariant"
          size="sm"
          :on-click="() => emit('close')"
        />
        <slot name="footer" />
      </div>
    </template>
  </DsfrModal>
</template>

<style lang="scss" scoped>
:deep(.fr-modal__header),
:deep(.fr-modal__body),
:deep(.fr-modal__footer) {
  background: var(--dialog) !important;
}

:deep(.fr-btn--close) {
  display: none !important;
}

.footer {
  display: flex;
  flex-direction: row;
  justify-content: right;
  width: 100%;
  gap: var(--spacing-sm);
}
</style>
