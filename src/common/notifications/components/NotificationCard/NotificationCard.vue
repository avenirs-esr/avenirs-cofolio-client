<script lang="ts" setup>
import type { Slot } from 'vue'
import Card from '@/common/components/cards/Card/Card.vue'
import { useDateUtils } from '@/common/composables'
import { AvIcon, MDI_ICONS, MS_ICONS } from '@avenirs-esr/avenirs-dsav'
import { type RouteLocationRaw, RouterLink } from 'vue-router'

export interface NotificationCardProps {
  id: string
  seen: boolean
  createdAt: string
  to?: RouteLocationRaw
}

const {
  id,
  seen,
  createdAt,
  to
} = defineProps<NotificationCardProps>()

const emit = defineEmits<{
  (e: 'redirect'): void
  (e: 'seen', id: string): void
}>()

defineSlots<{
  default: Slot
}>()

const { formatLastModified } = useDateUtils()

function handleRedirect () {
  emit('redirect')
  if (!seen) {
    emit('seen', id)
  }
}

onMounted(() => {
  if (!to && !seen) {
    emit('seen', id)
  }
})
</script>

<template>
  <component
    :is="to ? RouterLink : 'div'"
    v-bind="{ to }"
    class="notification-card"
    :class="{ 'notification-card--unseen': !seen }"
    data-testid="notification-card"
    :data-seen="seen"
    @click="to ? handleRedirect() : undefined"
  >
    <Card
      :background-color="seen ? 'var(--unselected-disabled-background)' : 'var(--light-background-primary1)'"
      border-color="transparent"
    >
      <template #body>
        <div class="av-row av-gap-xs">
          <div class="av-col av-justify-center">
            <div class="av-row av-align-center av-gap-xxs">
              <AvIcon
                :name="MDI_ICONS.CIRCLE"
                :size="0.5"
                :color="seen ? 'transparent' : 'var(--dark-background-error)'"
                data-testid="notification-card-bullet"
              />
              <AvIcon
                :name="MS_ICONS.CHAT_OUTLINE_ROUNDED"
                :size="1.5"
                color="var(--dark-background-primary1)"
                data-testid="notification-card-icon"
              />
            </div>
          </div>

          <div class="av-col av-w-full av-gap-xxxs">
            <div class="av-row">
              <slot />
            </div>
            <div class="av-row">
              <span
                class="caption-light"
                data-testid="notification-card-created-at"
              >
                {{ formatLastModified(createdAt, true) }}
              </span>
            </div>
          </div>

          <div class="av-col av-justify-center">
            <AvIcon
              :name="MDI_ICONS.ARROW_RIGHT_THIN"
              :size="1.5"
              :color="to ? 'var(--dark-background-primary1)' : 'transparent'"
              data-testid="notification-card-redirect-icon"
            />
          </div>
        </div>
      </template>
    </Card>
  </component>
</template>

<style lang="scss" scoped>
.notification-card {
  :deep() {
    .av-card {
      border-radius: var(--radius-lg) !important;
      position: relative;

      &:hover {
        border: 1px solid var(--selected-disabled-background) !important;
        box-shadow: 0 0 0 2px var(--selected-disabled-background);
      }
    }
  }

  &--unseen {
    :deep() {
      .av-card:hover {
        border: 1px solid var(--dark-background-primary1) !important;
        box-shadow: 0 0 0 2px var(--dark-background-primary1);
      }
    }
  }
}
</style>
