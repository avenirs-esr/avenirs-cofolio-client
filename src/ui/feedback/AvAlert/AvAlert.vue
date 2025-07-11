<!-- This code is an adaptation of the source code of DsfrAlert available at:
 https://vue-ds.fr/composants/DsfrAlert -->

<script setup lang="ts">
import type { Slot } from 'vue'
import AvVIcon from '@/ui/base/AvVIcon/AvVIcon.vue'
import AvButton from '@/ui/interaction/buttons/AvButton/AvButton.vue'
import { MDI_ICONS } from '@/ui/tokens/icons'

/**
 * AvAlert component props.
 */
interface AvAlertProps {
  /**
   * If true, the alert is displayed with the `alert` role.
   * @default false
   */
  alert?: boolean

  /**
   * Indicates whether the alert is closed (`true`) or visible (`false`).
   * @default false
   */
  closed?: boolean

  /**
   * Indicates whether the alert can be closed using a button.
   * @default false
   */
  closeable?: boolean

  /**
   * The alert unique identifier.
   * @default crypto.randomUUID()
   */
  id?: string

  /**
   * The alert title.
   * @default ''
   */
  title?: string

  /**
   * The alert description text.
   */
  description?: string

  /**
   * Indicates whether the alert should be displayed in a small format.
   * @default false
   */
  small?: boolean

  /**
   * The HTML tag used for the alert title.
   * @default 'h3'
   */
  titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  /**
   * The alert type. Affects the color and icon.
   * @default 'info'
   */
  type?: 'info' | 'success' | 'warning' | 'error'

  /**
   * The label and aria-label of the alert close button.
   * @default 'Fermer'
   */
  closeButtonLabel?: string
}

const {
  alert = false,
  id = crypto.randomUUID(),
  title = '',
  titleTag = 'h3',
  description,
  type = 'info',
  closeButtonLabel = 'Fermer',
  small = false
} = defineProps<AvAlertProps>()

/**
 * Events emitted by AvAlert.
 * @event close - Event triggered when the alert closes.
 */
const emit = defineEmits<{
  /**
   * Event triggered when the alert closes.
   */
  (e: 'close'): void
}>()

/**
 * Slots available in the AvAlert component.
 *
 * @slot default - Default slot for global content.
 */
defineSlots<{
  /**
   * Default slot for global content.
   */
  default?: Slot
}>()

const onClick = () => emit('close')

const classes = computed(() => ([
  `fr-alert--${type}`,
  {
    'fr-alert--sm': small,
  },
]),
)

const icon = computed(() => {
  switch (type) {
    case 'error':
      return { name: MDI_ICONS.ALERT_CIRCLE_OUTLINE, color: 'var(--dark-background-error)' }
    case 'success':
      return { name: MDI_ICONS.CHECK_CIRCLE, color: 'var(--dark-background-success)' }
    case 'warning':
      return { name: MDI_ICONS.WARNING_OUTLINE, color: 'var(--dark-background-warn)' }
    case 'info':
    default:
      return { name: MDI_ICONS.INFORMATION_OUTLINE, color: 'var(--dark-background-primary1)' }
  }
})
</script>

<template>
  <div
    v-if="!closed"
    :id="id"
    class="fr-alert"
    :class="classes"
    :role="alert ? 'alert' : undefined"
  >
    <div class="av-alert--container">
      <div class="av-alert--content">
        <AvVIcon
          v-bind="icon"
          :size="3"
        />
        <div class="av-alert--title">
          <component
            :is="titleTag"
            v-if="!small"
            class="fr-alert__title"
          >
            {{ title }}
          </component>
          <slot>
            <span class="b1-regular">{{ description }}</span>
          </slot>
        </div>
      </div>
      <AvButton
        v-if="closeable"
        icon-only
        :icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
        :label="closeButtonLabel"
        small
        :on-click="onClick"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fr-alert::before {
  content: '' !important;
  background: none !important;
}

.fr-alert {
  background-image: none !important;
  background-color: var(--dialog);
  border: 1px solid var(--dark-background-primary1);
  border-radius: var(--radius-lg);
  margin: 0;
  padding: var(--spacing-md);
}

.av-alert--container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.av-alert--content {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-sm);
}

.av-alert--title {
  display: flex;
  flex-direction: column;
}
</style>
