<!-- This code is an adaptation of the source code of DsfrAlert available at:
 https://vue-ds.fr/composants/DsfrAlert -->

<script setup lang="ts">
import AvVIcon from '@/ui/base/AvVIcon/AvVIcon.vue'
import { AvButton } from '@/ui/interaction'
import { MDI_ICONS } from '@/ui/tokens'
import { type DsfrAlertProps, getRandomId } from '@gouvminint/vue-dsfr'

const {
  alert = false,
  id = getRandomId('basic', 'alert'),
  title = '',
  titleTag = 'h3',
  description,
  type = 'info',
  closeButtonLabel = 'Fermer',
  small = false
} = defineProps<DsfrAlertProps>()

const emit = defineEmits<{ (e: 'close'): void }>()
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
        :title="closeButtonLabel"
        :aria-label="closeButtonLabel"
        small
        @click="onClick"
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
  border-radius: 0.75rem;
  margin: 0;
  padding: 1.5rem;
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
  gap: 1rem;
}

.av-alert--title {
  display: flex;
  flex-direction: column;
}
</style>
